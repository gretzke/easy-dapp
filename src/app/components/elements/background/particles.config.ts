import { InteractivityDetect, MoveDirection, OutMode, ThemeMode } from 'tsparticles-engine';

export const particlesOptions = {
  fpsLimit: 60,
  fullScreen: { enable: true, zIndex: -1 },
  particles: {
    number: {
      value: 15,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: 200,
      random: {
        enable: true,
        minimumValue: 100,
      },
    },
    move: {
      enable: true,
      speed: 1,
      direction: MoveDirection.top,
      outModes: {
        default: OutMode.out,
        top: OutMode.destroy,
        bottom: OutMode.none,
      },
    },
  },
  interactivity: {
    detectsOn: InteractivityDetect.window,
    events: {
      resize: true,
    },
  },
  style: {
    filter: 'blur(60px)',
    transform: 'scale(1.3)',
  },
  detectRetina: true,
  themes: [
    {
      name: 'light',
      default: {
        value: true,
        mode: ThemeMode.light,
      },
      options: {
        background: {
          color: '#ffffff',
        },
        particles: {
          color: {
            value: ['#ED1C24', '#067BC2', '#C879FF', '#9DFFF9', '#45F0DF'],
          },
          opacity: {
            value: 0.1,
          },
        },
      },
    },
    {
      name: 'dark',
      default: {
        value: true,
        mode: ThemeMode.dark,
      },
      options: {
        background: {
          color: '#000000',
        },
        particles: {
          color: {
            value: ['#ED1C24', '#067BC2', '#C879FF', '#9DFFF9', '#45F0DF'],
          },
          opacity: {
            value: 0.1,
          },
        },
      },
    },
  ],
  emitters: {
    direction: 'top',
    position: {
      x: 50,
      y: 150,
    },
    rate: {
      delay: 2,
      quantity: 1,
    },
    size: {
      width: 100,
      height: 0,
    },
  },
};
