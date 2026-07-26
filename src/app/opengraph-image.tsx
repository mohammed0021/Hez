import { ImageResponse } from 'next/og';

export const alt = 'Hêz — Premium Fitness Tracking';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #065f46 50%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 900,
          color: '#10b981',
          letterSpacing: '-4px',
          marginBottom: 16,
        }}
      >
        Hêz
      </div>
      <div
        style={{
          fontSize: 36,
          color: '#a3e635',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}
      >
        Premium Fitness Tracking
      </div>
      <div
        style={{
          display: 'flex',
          gap: 32,
          marginTop: 32,
        }}
      >
        {['Workouts', 'Progress', 'Nutrition', 'Supplements'].map((item) => (
          <div
            key={item}
            style={{
              padding: '12px 24px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 12,
              fontSize: 20,
              color: '#d1d5db',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
