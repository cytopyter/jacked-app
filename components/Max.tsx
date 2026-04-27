import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Ellipse, Path, Circle, Rect } from 'react-native-svg';

type MaxMood = 'default' | 'cheer' | 'think';

interface MaxProps {
  size?: number;
  mood?: MaxMood;
}

export default function Max({ size = 160, mood = 'default' }: MaxProps) {
  const isCheer = mood === 'cheer';
  const isThink = mood === 'think';
  const stroke = '#0E1F3A';
  const sw = 3;
  const h = size * 1.15;

  return (
    <Svg width={size} height={h} viewBox="0 0 200 230" style={{ overflow: 'visible' }}>
      <Defs>
        <LinearGradient id="maxFur" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#7FB4F0" />
          <Stop offset="100%" stopColor="#4A8BD9" />
        </LinearGradient>
        <LinearGradient id="maxBelly" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E8F1FA" />
          <Stop offset="100%" stopColor="#BFD3E6" />
        </LinearGradient>
        <LinearGradient id="maxBand" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#3FCB5A" />
          <Stop offset="100%" stopColor="#23A742" />
        </LinearGradient>
        <LinearGradient id="maxBell" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#A6AEBC" />
          <Stop offset="100%" stopColor="#6B7280" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="100" cy="222" rx="55" ry="6" fill="#000" opacity={0.18} />

      {/* Legs */}
      <Ellipse cx="78" cy="210" rx="20" ry="14" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
      <Ellipse cx="122" cy="210" rx="20" ry="14" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />

      {/* Body */}
      <Path d="M55 175 Q 50 130 75 120 L 125 120 Q 150 130 145 175 Q 145 210 100 212 Q 55 210 55 175 Z"
        fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
      <Ellipse cx="100" cy="170" rx="32" ry="38" fill="url(#maxBelly)" />

      {/* Arms */}
      {isCheer ? (
        <>
          <Path d="M62 130 Q 35 100 38 60" stroke="#4A8BD9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <Path d="M138 130 Q 165 100 162 60" stroke="#4A8BD9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <Path d="M62 130 Q 35 100 38 60" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Path d="M138 130 Q 165 100 162 60" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Circle cx="38" cy="55" r="13" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
          <Circle cx="162" cy="55" r="13" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
        </>
      ) : isThink ? (
        <>
          <Path d="M62 135 Q 50 165 65 175" stroke="#4A8BD9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <Path d="M62 135 Q 50 165 65 175" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Circle cx="68" cy="178" r="12" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
          <Path d="M138 130 Q 130 110 118 95" stroke="#4A8BD9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <Path d="M138 130 Q 130 110 118 95" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Circle cx="118" cy="92" r="13" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
        </>
      ) : (
        <>
          <Path d="M62 135 Q 50 160 60 178" stroke="#4A8BD9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <Path d="M62 135 Q 50 160 60 178" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Circle cx="62" cy="180" r="12" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
          <Path d="M138 135 Q 152 145 158 158" stroke="#4A8BD9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <Path d="M138 135 Q 152 145 158 158" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Circle cx="158" cy="160" r="13" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
          <Rect x="135" y="156" width="48" height="8" rx="2" fill="url(#maxBell)" stroke={stroke} strokeWidth="2" />
          <Rect x="125" y="146" width="14" height="28" rx="3" fill="url(#maxBell)" stroke={stroke} strokeWidth={sw} />
          <Rect x="179" y="146" width="14" height="28" rx="3" fill="url(#maxBell)" stroke={stroke} strokeWidth={sw} />
        </>
      )}

      {/* Ears */}
      <Circle cx="56" cy="56" r="16" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
      <Circle cx="144" cy="56" r="16" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />
      <Circle cx="56" cy="58" r="7" fill="#4A8BD9" />
      <Circle cx="144" cy="58" r="7" fill="#4A8BD9" />

      {/* Head */}
      <Circle cx="100" cy="78" r="44" fill="url(#maxFur)" stroke={stroke} strokeWidth={sw} />

      {/* Hair tuft */}
      <Path d="M82 42 Q 88 28 96 36 Q 100 26 108 34 Q 116 28 118 42 Q 110 40 100 44 Q 90 42 82 42 Z"
        fill="#F5FAFF" stroke={stroke} strokeWidth="2.5" />

      {/* Headband */}
      <Path d="M58 62 Q 100 50 142 62 L 142 76 Q 100 66 58 76 Z" fill="url(#maxBand)" stroke={stroke} strokeWidth={sw} />
      <Path d="M62 64 Q 100 54 138 64" stroke="#7FE39B" strokeWidth="2" fill="none" opacity={0.7} />

      {/* Eye mask */}
      <Ellipse cx="83" cy="86" rx="13" ry="11" fill="#1B2C45" />
      <Ellipse cx="117" cy="86" rx="13" ry="11" fill="#1B2C45" />

      {/* Eyes */}
      <Circle cx="84" cy="86" r="6.5" fill="#0E1F3A" />
      <Circle cx="116" cy="86" r="6.5" fill="#0E1F3A" />
      <Circle cx="86" cy="84" r="2" fill="#fff" />
      <Circle cx="118" cy="84" r="2" fill="#fff" />

      {/* Snout */}
      <Ellipse cx="100" cy="103" rx="14" ry="10" fill="#F5FAFF" opacity={0.85} />
      <Ellipse cx="100" cy="98" rx="4.5" ry="3.5" fill="#0E1F3A" />
      {isCheer ? (
        <Path d="M93 106 Q 100 116 107 106" stroke={stroke} strokeWidth="2.8" fill="#7a2424" strokeLinecap="round" />
      ) : (
        <Path d="M100 101 V 105 M 95 108 Q 100 112 105 108" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </Svg>
  );
}
