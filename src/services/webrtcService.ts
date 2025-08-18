import { Socket } from 'socket.io-client';

export interface VoiceParticipant {
  userId: number;
  username: string;
  socketId?: string;
  hasVideo?: boolean;
}

export class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private socket: Socket;
  private currentChannelId: number | null = null;
  private onParticipantsChange?: (participants: VoiceParticipant[]) => void;
  private onConnectionStateChange?: (socketId: string, state: RTCPeerConnectionState) => void;
  private onRemoteStreamChange?: (socketId: string, stream: MediaStream | null) => void;

  constructor(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('voice_channel_participants', (participants: VoiceParticipant[]) => {
      console.log('[WEBRTC] Received participants:', participants);
      this.onParticipantsChange?.(participants);
      
      // Create peer connections for existing participants (when we join)
      if (this.localStream) {
        participants.forEach(async (participant) => {
          if (participant.socketId && participant.socketId !== this.socket.id) {
            if (!this.peerConnections.has(participant.socketId)) {
              console.log('[WEBRTC] Creating peer connection for existing participant:', participant.username);
              await this.createPeerConnection(participant.socketId, true);
            }
          }
        });
      }
    });

    this.socket.on('user_joined_voice', async ({ userId, username, socketId }: VoiceParticipant & { socketId: string }) => {
      console.log('[WEBRTC] User joined voice:', { userId, username, socketId });
      
      // Only create peer connection if we have local stream and it's not ourselves
      if (this.localStream && socketId !== this.socket.id) {
        if (!this.peerConnections.has(socketId)) {
          console.log('[WEBRTC] Creating peer connection for new participant:', username);
          await this.createPeerConnection(socketId, true);
        }
      }
    });

    this.socket.on('user_left_voice', ({ socketId }: { socketId: string }) => {
      console.log('[WEBRTC] User left voice:', socketId);
      this.closePeerConnection(socketId);
    });

    this.socket.on('webrtc_offer', async ({ offer, senderSocketId, channelId }) => {
      console.log(`[WEBRTC] Received offer from ${senderSocketId} for channel ${channelId}`);
      if (channelId === this.currentChannelId) {
        await this.handleOffer(offer, senderSocketId);
      }
    });

    this.socket.on('webrtc_answer', async ({ answer, senderSocketId }) => {
      console.log(`[WEBRTC] Received answer from ${senderSocketId}`);
      const peerConnection = this.peerConnections.get(senderSocketId);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log(`[WEBRTC] Set remote description for ${senderSocketId}`);
      }
    });

    this.socket.on('webrtc_ice_candidate', async ({ candidate, senderSocketId }) => {
      console.log(`[WEBRTC] Received ICE candidate from ${senderSocketId}`);
      const peerConnection = this.peerConnections.get(senderSocketId);
      if (peerConnection && candidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`[WEBRTC] Added ICE candidate for ${senderSocketId}`);
        } catch (error) {
          console.error(`[WEBRTC] Error adding ICE candidate for ${senderSocketId}:`, error);
        }
      }
    });

    this.socket.on('user_video_state_changed', ({ socketId, hasVideo }) => {
      console.log(`[WEBRTC] User ${socketId} changed video state to: ${hasVideo}`);
      // The participant list will be updated automatically, 
      // and the UI will reflect the video state change
    });
  }

  async joinVoiceChannel(channelId: number, userId: number, username: string, enableVideo: boolean = false) {
    try {
      console.log('[WEBRTC] Requesting user media...');
      // Get user media (microphone and optionally camera)
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: enableVideo ? {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        } : false,
      });

      console.log('[WEBRTC] Got user media, stream:', this.localStream);
      this.currentChannelId = channelId;

      // Join the voice channel via socket
      console.log('[WEBRTC] Emitting join_voice_channel event...');
      this.socket.emit('join_voice_channel', { channelId, userId, username, hasVideo: enableVideo });

      return this.localStream;
    } catch (error) {
      console.error('[WEBRTC] Error joining voice channel:', error);
      throw error;
    }
  }

  async leaveVoiceChannel(userId: number, username: string) {
    if (this.currentChannelId) {
      // Leave the voice channel via socket
      this.socket.emit('leave_voice_channel', {
        channelId: this.currentChannelId,
        userId,
        username,
      });

      // Close all peer connections
      for (const [socketId] of this.peerConnections) {
        this.closePeerConnection(socketId);
      }

      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      this.currentChannelId = null;
    }
  }

  private async createPeerConnection(socketId: string, isInitiator: boolean) {
    try {
      console.log(`[WEBRTC] Creating peer connection with ${socketId}, isInitiator: ${isInitiator}`);
      
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      this.peerConnections.set(socketId, peerConnection);

      // Add local stream to peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          console.log(`[WEBRTC] Adding track to peer connection: ${track.kind}`);
          peerConnection.addTrack(track, this.localStream!);
        });
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log(`[WEBRTC] Received remote track from ${socketId}:`, event.track.kind);
        const [remoteStream] = event.streams;
        this.playRemoteStream(socketId, remoteStream);
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`[WEBRTC] Sending ICE candidate to ${socketId}`);
          this.socket.emit('webrtc_ice_candidate', {
            targetSocketId: socketId,
            candidate: event.candidate,
            channelId: this.currentChannelId,
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`[WEBRTC] Connection state with ${socketId}: ${peerConnection.connectionState}`);
        this.onConnectionStateChange?.(socketId, peerConnection.connectionState);
        if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'disconnected') {
          this.closePeerConnection(socketId);
        }
      };

      // If we're the initiator, create and send offer
      if (isInitiator) {
        console.log(`[WEBRTC] Creating offer for ${socketId}`);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        console.log(`[WEBRTC] Sending offer to ${socketId}`);
        this.socket.emit('webrtc_offer', {
          targetSocketId: socketId,
          offer,
          channelId: this.currentChannelId,
        });
      }
    } catch (error) {
      console.error(`[WEBRTC] Error creating peer connection with ${socketId}:`, error);
      this.closePeerConnection(socketId);
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit, senderSocketId: string) {
    try {
      console.log(`[WEBRTC] Handling offer from ${senderSocketId}`);
      await this.createPeerConnection(senderSocketId, false);
      const peerConnection = this.peerConnections.get(senderSocketId);
      
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        console.log(`[WEBRTC] Set remote description from ${senderSocketId}`);
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log(`[WEBRTC] Created and set local answer for ${senderSocketId}`);
        
        this.socket.emit('webrtc_answer', {
          targetSocketId: senderSocketId,
          answer,
          channelId: this.currentChannelId,
        });
        console.log(`[WEBRTC] Sent answer to ${senderSocketId}`);
      }
    } catch (error) {
      console.error(`[WEBRTC] Error handling offer from ${senderSocketId}:`, error);
    }
  }

  private playRemoteStream(socketId: string, stream: MediaStream) {
    console.log(`[WEBRTC] Playing remote stream from ${socketId}`, stream);
    
    // Handle audio tracks
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      let audioElement = document.getElementById(`audio-${socketId}`) as HTMLAudioElement;
      if (!audioElement) {
        audioElement = document.createElement('audio');
        audioElement.id = `audio-${socketId}`;
        audioElement.autoplay = true;
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);
        console.log(`[WEBRTC] Created audio element for ${socketId}`);
      }
      
      audioElement.srcObject = stream;
      
      // Add event listeners to debug audio playback
      audioElement.onloadedmetadata = () => {
        console.log(`[WEBRTC] Audio metadata loaded for ${socketId}`);
      };
      
      audioElement.onplay = () => {
        console.log(`[WEBRTC] Audio started playing for ${socketId}`);
      };
      
      audioElement.onerror = (error) => {
        console.error(`[WEBRTC] Audio error for ${socketId}:`, error);
      };
    }

    // Notify about remote stream change (for video handling in components)
    this.onRemoteStreamChange?.(socketId, stream);
  }

  private closePeerConnection(socketId: string) {
    const peerConnection = this.peerConnections.get(socketId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(socketId);
    }

    // Remove audio element
    const audioElement = document.getElementById(`audio-${socketId}`);
    if (audioElement) {
      audioElement.remove();
    }

    // Notify about stream removal
    this.onRemoteStreamChange?.(socketId, null);
  }

  setOnParticipantsChange(callback: (participants: VoiceParticipant[]) => void) {
    this.onParticipantsChange = callback;
  }

  setOnConnectionStateChange(callback: (socketId: string, state: RTCPeerConnectionState) => void) {
    this.onConnectionStateChange = callback;
  }

  setOnRemoteStreamChange(callback: (socketId: string, stream: MediaStream | null) => void) {
    this.onRemoteStreamChange = callback;
  }

  toggleMute(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // Return true if muted
      }
    }
    return false;
  }

  isMuted(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      return audioTrack ? !audioTrack.enabled : true;
    }
    return true;
  }

  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    
    if (videoTrack) {
      // If we have a video track, stop and remove it
      videoTrack.stop();
      this.localStream.removeTrack(videoTrack);
      
      // Update all peer connections to remove video track and renegotiate
      for (const [socketId, peerConnection] of this.peerConnections) {
        const sender = peerConnection.getSenders().find(s => s.track === videoTrack);
        if (sender) {
          try {
            await sender.replaceTrack(null);
            // Create new offer to renegotiate without video
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            this.socket.emit('webrtc_offer', {
              targetSocketId: socketId,
              offer,
              channelId: this.currentChannelId,
            });
          } catch (error) {
            console.error(`[WEBRTC] Error removing video track for ${socketId}:`, error);
          }
        }
      }
      
      // Notify server about video state change
      if (this.currentChannelId) {
        this.socket.emit('video_state_changed', {
          channelId: this.currentChannelId,
          hasVideo: false
        });
      }
      
      return false;
    } else {
      // If we don't have a video track, add one
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 },
          }
        });
        
        const newVideoTrack = videoStream.getVideoTracks()[0];
        if (newVideoTrack) {
          this.localStream.addTrack(newVideoTrack);
          
          // Add video track to all peer connections and renegotiate
          for (const [socketId, peerConnection] of this.peerConnections) {
            try {
              await peerConnection.addTrack(newVideoTrack, this.localStream);
              
              // Create new offer to renegotiate with video
              const offer = await peerConnection.createOffer();
              await peerConnection.setLocalDescription(offer);
              
              this.socket.emit('webrtc_offer', {
                targetSocketId: socketId,
                offer,
                channelId: this.currentChannelId,
              });
            } catch (error) {
              console.error(`[WEBRTC] Error adding video track for ${socketId}:`, error);
            }
          }
          
          // Notify server about video state change
          if (this.currentChannelId) {
            this.socket.emit('video_state_changed', {
              channelId: this.currentChannelId,
              hasVideo: true
            });
          }
          
          return true;
        }
      } catch (error) {
        console.error('[WEBRTC] Error enabling video:', error);
        throw error;
      }
    }
    
    return false;
  }

  hasVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      return videoTrack ? videoTrack.enabled : false;
    }
    return false;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(socketId: string): MediaStream | null {
    // This will be handled by the component through the callback
    return null;
  }

  cleanup() {
    // Close all peer connections
    for (const [socketId] of this.peerConnections) {
      this.closePeerConnection(socketId);
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.currentChannelId = null;
  }
}