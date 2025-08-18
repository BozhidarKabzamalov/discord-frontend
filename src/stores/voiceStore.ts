import { create } from 'zustand';
import { WebRTCService, VoiceParticipant } from '../services/webrtcService';
import { socket } from '../socket';

interface VoiceState {
  webrtcService: WebRTCService;
  currentVoiceChannelId: number | null;
  participants: VoiceParticipant[];
  isConnected: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  hasVideo: boolean;
  connectionStates: Map<string, RTCPeerConnectionState>;
  remoteStreams: Map<string, MediaStream>;
  
  // Actions
  joinVoiceChannel: (channelId: number, userId: number, username: string, enableVideo?: boolean) => Promise<void>;
  leaveVoiceChannel: (userId: number, username: string) => Promise<void>;
  leaveCurrentVoiceChannel: () => Promise<void>;
  toggleMute: () => void;
  toggleDeafen: () => void;
  toggleVideo: () => Promise<void>;
  setParticipants: (participants: VoiceParticipant[]) => void;
  addParticipant: (participant: VoiceParticipant) => void;
  removeParticipant: (socketId: string) => void;
  updateConnectionState: (socketId: string, state: RTCPeerConnectionState) => void;
  setRemoteStream: (socketId: string, stream: MediaStream | null) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => {
  const webrtcService = new WebRTCService(socket);

  // Setup callbacks
  webrtcService.setOnParticipantsChange((participants) => {
    console.log('[VOICE STORE] Participants updated:', participants);
    set({ participants });
  });

  webrtcService.setOnConnectionStateChange((socketId, state) => {
    const { connectionStates } = get();
    const newStates = new Map(connectionStates);
    newStates.set(socketId, state);
    set({ connectionStates: newStates });
  });

  webrtcService.setOnRemoteStreamChange((socketId, stream) => {
    const { remoteStreams } = get();
    const newStreams = new Map(remoteStreams);
    if (stream) {
      newStreams.set(socketId, stream);
    } else {
      newStreams.delete(socketId);
    }
    set({ remoteStreams: newStreams });
  });

  return {
    webrtcService,
    currentVoiceChannelId: null,
    participants: [],
    isConnected: false,
    isMuted: false,
    isDeafened: false,
    hasVideo: false,
    connectionStates: new Map(),
    remoteStreams: new Map(),

    joinVoiceChannel: async (channelId: number, userId: number, username: string, enableVideo: boolean = false) => {
      try {
        console.log('[VOICE STORE] Attempting to join voice channel:', { channelId, userId, username });
        
        // If already in a voice channel, leave it first
        const { currentVoiceChannelId, isConnected } = get();
        if (isConnected && currentVoiceChannelId && currentVoiceChannelId !== channelId) {
          console.log('[VOICE STORE] Already in voice channel, leaving first...');
          await webrtcService.leaveVoiceChannel(userId, username);
        }
        
        // Ensure socket is connected
        if (!socket.connected) {
          console.log('[VOICE STORE] Socket not connected, connecting...');
          socket.connect();
          // Wait a bit for connection to establish
          await new Promise(resolve => {
            if (socket.connected) {
              resolve(true);
            } else {
              socket.on('connect', () => {
                console.log('[VOICE STORE] Socket connected');
                resolve(true);
              });
            }
          });
        }
        
        const stream = await webrtcService.joinVoiceChannel(channelId, userId, username, enableVideo);
        console.log('[VOICE STORE] Successfully joined voice channel, got stream:', !!stream);
        set({
          currentVoiceChannelId: channelId,
          isConnected: true,
          isMuted: false,
          isDeafened: false,
          hasVideo: enableVideo,
        });
      } catch (error) {
        console.error('[VOICE STORE] Failed to join voice channel:', error);
        throw error;
      }
    },

    leaveVoiceChannel: async (userId: number, username: string) => {
      await webrtcService.leaveVoiceChannel(userId, username);
      set({
        currentVoiceChannelId: null,
        participants: [],
        isConnected: false,
        isMuted: false,
        isDeafened: false,
        hasVideo: false,
        connectionStates: new Map(),
        remoteStreams: new Map(),
      });
    },

    leaveCurrentVoiceChannel: async () => {
      const { isConnected } = get();
      if (isConnected) {
        // We need user info to leave, but we'll handle this in the component
        await webrtcService.leaveVoiceChannel(0, 'unknown'); // Fallback
        set({
          currentVoiceChannelId: null,
          participants: [],
          isConnected: false,
          isMuted: false,
          isDeafened: false,
          hasVideo: false,
          connectionStates: new Map(),
          remoteStreams: new Map(),
        });
      }
    },

    toggleMute: () => {
      const isMuted = webrtcService.toggleMute();
      set({ isMuted });
    },

    toggleDeafen: () => {
      const { isDeafened } = get();
      const newDeafenedState = !isDeafened;
      
      // When deafening, also mute
      if (newDeafenedState && !get().isMuted) {
        webrtcService.toggleMute();
        set({ isMuted: true });
      }
      
      // Mute/unmute all remote audio elements
      const audioElements = document.querySelectorAll('audio[id^="audio-"]') as NodeListOf<HTMLAudioElement>;
      audioElements.forEach(audio => {
        audio.muted = newDeafenedState;
      });
      
      set({ isDeafened: newDeafenedState });
    },

    setParticipants: (participants: VoiceParticipant[]) => {
      set({ participants });
    },

    addParticipant: (participant: VoiceParticipant) => {
      const { participants } = get();
      const exists = participants.some(p => p.userId === participant.userId);
      if (!exists) {
        set({ participants: [...participants, participant] });
      }
    },

    removeParticipant: (socketId: string) => {
      const { participants, connectionStates } = get();
      const newParticipants = participants.filter(p => p.socketId !== socketId);
      const newStates = new Map(connectionStates);
      newStates.delete(socketId);
      set({ participants: newParticipants, connectionStates: newStates });
    },

    updateConnectionState: (socketId: string, state: RTCPeerConnectionState) => {
      const { connectionStates } = get();
      const newStates = new Map(connectionStates);
      newStates.set(socketId, state);
      set({ connectionStates: newStates });
    },

    toggleVideo: async () => {
      try {
        const hasVideo = await webrtcService.toggleVideo();
        set({ hasVideo });
      } catch (error) {
        console.error('[VOICE STORE] Failed to toggle video:', error);
        throw error;
      }
    },

    setRemoteStream: (socketId: string, stream: MediaStream | null) => {
      const { remoteStreams } = get();
      const newStreams = new Map(remoteStreams);
      if (stream) {
        newStreams.set(socketId, stream);
      } else {
        newStreams.delete(socketId);
      }
      set({ remoteStreams: newStreams });
    },
  };
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  const { webrtcService } = useVoiceStore.getState();
  webrtcService.cleanup();
});