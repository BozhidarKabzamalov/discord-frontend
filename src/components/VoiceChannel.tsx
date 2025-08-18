import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import {
	FaMicrophone,
	FaMicrophoneSlash,
	FaVolumeUp,
	FaVolumeOff,
	FaPhoneSlash,
	FaVideo,
	FaVideoSlash,
} from "react-icons/fa";
import { useVoiceStore } from "../stores/voiceStore";
import { useBoundStore } from "../stores/useBoundStore";

// Generate a consistent color based on username
const getUserColor = (username: string): string => {
	const colors = [
		"#3ba55d", // green
		"#5865f2", // blue
		"#ed4245", // red
		"#f57976", // light red
		"#8da1fc", // light blue
		"#faa61a", // orange
		"#9c84ef", // purple
		"#57f287", // light green
	];

	let hash = 0;
	for (let i = 0; i < username.length; i++) {
		hash = username.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
};

const VoiceChannel: React.FC = () => {
	const { channelId } = useParams();
	const user = useBoundStore((state) => state.authenticatedUser);
	const [isJoining, setIsJoining] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		currentVoiceChannelId,
		participants,
		isConnected,
		isMuted,
		isDeafened,
		hasVideo,
		remoteStreams,
		webrtcService,
		joinVoiceChannel,
		leaveVoiceChannel,
		toggleMute,
		toggleDeafen,
		toggleVideo,
	} = useVoiceStore();

	const isInThisChannel = currentVoiceChannelId === parseInt(channelId!);

	const handleJoinVoice = async () => {
		if (!user || !channelId) return;

		setIsJoining(true);
		setError(null);

		try {
			await joinVoiceChannel(
				parseInt(channelId),
				user.id,
				user.username,
				false
			);
		} catch (err) {
			setError(
				"Failed to join voice channel. Please check your microphone permissions."
			);
			console.error("Voice channel join error:", err);
		} finally {
			setIsJoining(false);
		}
	};

	const handleLeaveVoice = useCallback(async () => {
		if (!user) return;

		try {
			await leaveVoiceChannel(user.id, user.username);
		} catch (err) {
			console.error("Voice channel leave error:", err);
		}
	}, [leaveVoiceChannel, user]);

	const handleToggleVideo = async () => {
		try {
			await toggleVideo();
		} catch (err) {
			setError(
				"Failed to toggle video. Please check your camera permissions."
			);
			console.error("Video toggle error:", err);
		}
	};

	// Auto-join voice channel when component mounts
	useEffect(() => {
		const autoJoinVoice = async () => {
			if (!user || !channelId || isConnected || isJoining) return;

			// Only auto-join if we're not already in this specific channel
			if (currentVoiceChannelId === parseInt(channelId)) return;

			setIsJoining(true);
			setError(null);

			try {
				await joinVoiceChannel(
					parseInt(channelId),
					user.id,
					user.username,
					false
				);
			} catch (err) {
				setError(
					"Failed to join voice channel. Please check your microphone permissions."
				);
				console.error("Auto-join voice channel error:", err);
			} finally {
				setIsJoining(false);
			}
		};

		autoJoinVoice();
	}, [
		channelId,
		user,
		isConnected,
		currentVoiceChannelId,
		isJoining,
		joinVoiceChannel,
	]);

	// Auto-leave when navigating away from voice channel
	useEffect(() => {
		return () => {
			if (
				isConnected &&
				currentVoiceChannelId &&
				currentVoiceChannelId !== parseInt(channelId!)
			) {
				handleLeaveVoice();
			}
		};
	}, [channelId, currentVoiceChannelId, handleLeaveVoice, isConnected]);

	return (
		<Container>
			<Header>
				<Title>Voice Channel</Title>
				{error && <ErrorMessage>{error}</ErrorMessage>}
			</Header>

			<Content>
				{isJoining ? (
					<JoinSection>
						<JoinMessage>
							Connecting to voice channel...
						</JoinMessage>
						<LoadingSpinner />
					</JoinSection>
				) : (
					<VoiceSection>
						<ParticipantsSection>
							<ParticipantsTitle>
								Voice Channel ({participants.length})
							</ParticipantsTitle>
							<ParticipantsGrid>
								{participants.map((participant) => {
									const isCurrentUser =
										participant.userId === user?.id;
									const hasParticipantVideo =
										participant.hasVideo;
									const remoteStream = participant.socketId
										? remoteStreams.get(
												participant.socketId
										  )
										: null;
									const localStream = isCurrentUser
										? webrtcService.getLocalStream()
										: null;

									return (
										<ParticipantTile
											key={participant.userId}
											$isCurrentUser={isCurrentUser}
											$hasVideo={hasParticipantVideo}
										>
											{hasParticipantVideo &&
											(isCurrentUser
												? localStream
												: remoteStream) ? (
												<VideoContainer>
													<VideoElement
														ref={(video) => {
															if (
																video &&
																(isCurrentUser
																	? localStream
																	: remoteStream)
															) {
																video.srcObject =
																	isCurrentUser
																		? localStream
																		: remoteStream;
															}
														}}
														autoPlay
														muted={isCurrentUser} // Mute own video to prevent feedback
														playsInline
													/>
													<VideoOverlay>
														<ParticipantName>
															{
																participant.username
															}
														</ParticipantName>
														{isCurrentUser && (
															<YouLabel>
																(You)
															</YouLabel>
														)}
													</VideoOverlay>
												</VideoContainer>
											) : (
												<>
													<ParticipantAvatar
														$color={getUserColor(
															participant.username
														)}
													>
														{participant.username
															.charAt(0)
															.toUpperCase()}
													</ParticipantAvatar>
													<ParticipantInfo>
														<ParticipantName>
															{
																participant.username
															}
														</ParticipantName>
														{isCurrentUser && (
															<YouLabel>
																(You)
															</YouLabel>
														)}
													</ParticipantInfo>
												</>
											)}
										</ParticipantTile>
									);
								})}
							</ParticipantsGrid>
						</ParticipantsSection>

						<ControlsSection>
							<ControlButton
								onClick={toggleMute}
								$active={!isMuted}
								$danger={isMuted}
								title={isMuted ? "Unmute" : "Mute"}
							>
								{isMuted ? (
									<FaMicrophoneSlash />
								) : (
									<FaMicrophone />
								)}
							</ControlButton>

							<ControlButton
								onClick={handleToggleVideo}
								$active={hasVideo}
								$danger={!hasVideo}
								title={
									hasVideo
										? "Turn off camera"
										: "Turn on camera"
								}
							>
								{hasVideo ? <FaVideo /> : <FaVideoSlash />}
							</ControlButton>

							<ControlButton
								onClick={toggleDeafen}
								$active={!isDeafened}
								$danger={isDeafened}
								title={isDeafened ? "Undeafen" : "Deafen"}
							>
								{isDeafened ? <FaVolumeOff /> : <FaVolumeUp />}
							</ControlButton>

							<ControlButton
								onClick={handleLeaveVoice}
								$danger={true}
								title='Leave Voice Channel'
							>
								<FaPhoneSlash />
							</ControlButton>
						</ControlsSection>
					</VoiceSection>
				)}
			</Content>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.gray800};
`;

const Header = styled.div`
	padding: 20px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.gray700};
`;

const Title = styled.h2`
	color: ${({ theme }) => theme.colors.white};
	margin: 0 0 10px 0;
	font-size: 24px;
`;

const ErrorMessage = styled.div`
	color: ${({ theme }) => theme.colors.red};
	font-size: 14px;
	margin-top: 10px;
`;

const Content = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
`;

const JoinSection = styled.div`
	text-align: center;
`;

const JoinMessage = styled.p`
	color: ${({ theme }) => theme.colors.gray300};
	font-size: 18px;
	margin-bottom: 20px;
`;

const LoadingSpinner = styled.div`
	width: 40px;
	height: 40px;
	border: 4px solid ${({ theme }) => theme.colors.gray600};
	border-top: 4px solid ${({ theme }) => theme.colors.green};
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto;

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const VoiceSection = styled.div`
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

const ParticipantsSection = styled.div`
	background-color: ${({ theme }) => theme.colors.gray700};
	border-radius: 8px;
	padding: 20px;
`;

const ParticipantsTitle = styled.h3`
	color: ${({ theme }) => theme.colors.white};
	margin: 0 0 15px 0;
	font-size: 18px;
`;

const ParticipantsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 15px;
	min-height: 200px;
`;

const ParticipantTile = styled.div<{
	$isCurrentUser: boolean;
	$hasVideo?: boolean;
}>`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: ${({ $hasVideo }) => ($hasVideo ? "0" : "20px")};
	background-color: ${({ theme, $isCurrentUser, $hasVideo }) => {
		if ($hasVideo) return "transparent";
		return $isCurrentUser ? theme.colors.blue200 : theme.colors.gray600;
	}};
	border-radius: 12px;
	border: ${({ theme, $isCurrentUser }) =>
		$isCurrentUser
			? `2px solid ${theme.colors.blue300}`
			: "2px solid transparent"};
	transition: all 0.2s;
	overflow: hidden;
	position: relative;
	min-height: ${({ $hasVideo }) => ($hasVideo ? "200px" : "auto")};

	&:hover {
		background-color: ${({ theme, $isCurrentUser, $hasVideo }) => {
			if ($hasVideo) return "transparent";
			return $isCurrentUser ? theme.colors.blue300 : theme.colors.gray500;
		}};
	}
`;

const ParticipantAvatar = styled.div<{ $color: string }>`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background-color: ${({ $color }) => $color};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	font-weight: bold;
	color: white;
	margin-bottom: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	position: relative;

	/* Speaking indicator ring */
	&::after {
		content: "";
		position: absolute;
		top: -3px;
		left: -3px;
		right: -3px;
		bottom: -3px;
		border-radius: 50%;
		border: 3px solid ${({ theme }) => theme.colors.green};
		opacity: 0;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 0;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
		100% {
			opacity: 0;
			transform: scale(1);
		}
	}
`;

const ParticipantInfo = styled.div`
	text-align: center;
`;

const ParticipantName = styled.div`
	color: ${({ theme }) => theme.colors.white};
	font-weight: 500;
	font-size: 14px;
	margin-bottom: 4px;
`;

const YouLabel = styled.div`
	color: ${({ theme }) => theme.colors.gray300};
	font-size: 12px;
	font-style: italic;
`;

const VideoContainer = styled.div`
	position: relative;
	width: 100%;
	height: 200px;
	border-radius: 12px;
	overflow: hidden;
	background-color: ${({ theme }) => theme.colors.gray900};
`;

const VideoElement = styled.video`
	width: 100%;
	height: 100%;
	object-fit: cover;
	background-color: ${({ theme }) => theme.colors.gray900};
`;

const VideoOverlay = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	padding: 15px 10px 10px;
	text-align: center;
`;

const ControlsSection = styled.div`
	display: flex;
	justify-content: center;
	gap: 15px;
`;

const ControlButton = styled.button<{ $active?: boolean; $danger?: boolean }>`
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	cursor: pointer;
	transition: all 0.2s;

	background-color: ${({ theme, $active, $danger }) => {
		if ($danger) return theme.colors.red;
		if ($active) return theme.colors.green;
		return theme.colors.gray600;
	}};

	color: white;

	&:hover {
		transform: scale(1.1);
		opacity: 0.9;
	}

	&:active {
		transform: scale(0.95);
	}
`;

export default VoiceChannel;
