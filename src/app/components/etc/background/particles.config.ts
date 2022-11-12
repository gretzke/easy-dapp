import { InteractivityDetect, MoveDirection, OutMode, ThemeMode } from 'tsparticles-engine';

export const particlesOptions = {
  fpsLimit: 60,
  fullScreen: { enable: true, zIndex: -1 },
  particles: {
    number: {
      value: 50,
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.3,
    },
    size: {
      value: 400,
      random: {
        enable: false,
        minimumValue: 200,
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
    filter: 'blur(50px)',
    transform: 'scale(1.1)',
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
          color: '#f7f8ef',
        },
        particles: {
          color: {
            value: ['#0A2463', '#A24936', '#9882AC', '#75DDDD', '#2EC0F9'],
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
          color: '#080710',
        },
        particles: {
          color: {
            value: ['#0A2463', '#A24936', '#9882AC', '#75DDDD', '#2EC0F9'],
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
      delay: 0.2,
      quantity: 2,
    },
    size: {
      width: 100,
      height: 0,
    },
  },
};
