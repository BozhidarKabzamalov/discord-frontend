import {
	FaMicrophone,
	FaMicrophoneSlash,
	FaPhoneSlash,
	FaVideo,
	FaVideoSlash,
	FaVolumeOff,
	FaVolumeUp,
} from "react-icons/fa";
import { useVoiceStore } from "../stores/voiceStore";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { useBoundStore } from "../stores/useBoundStore";
import { useCallback } from "react";

const MediaControls = () => {
    const navigate = useNavigate();
    const { serverId } = useParams();
    const user = useBoundStore((state) => state.authenticatedUser);
	const {
		isMuted,
		isDeafened,
		hasVideo,
		leaveVoiceChannel,
		toggleMute,
		toggleDeafen,
		toggleVideo,
	} = useVoiceStore();

	const handleLeaveVoice = useCallback(async () => {
		if (!user || !serverId) return;

		try {
			await leaveVoiceChannel(user.id, user.username);
			navigate(`/channels/${serverId}`);
		} catch (err) {
			console.error("Voice channel leave error:", err);
		}
	}, [leaveVoiceChannel, user, serverId, navigate]);

	const handleToggleVideo = async () => {
		await toggleVideo();
	};

	return (
		<ControlsSection>
			<ControlButton
				onClick={toggleMute}
				$active={!isMuted}
				$danger={isMuted}
				title={isMuted ? "Unmute" : "Mute"}
			>
				{isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
			</ControlButton>

			<ControlButton
				onClick={handleToggleVideo}
				$active={hasVideo}
				$danger={!hasVideo}
				title={hasVideo ? "Turn off camera" : "Turn on camera"}
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
	);
};

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

export default MediaControls;
