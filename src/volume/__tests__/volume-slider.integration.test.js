/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../volume-audio.js', () => ({
  initAudio: vi.fn(),
  play: vi.fn(),
  stop: vi.fn(),
  setVolume: vi.fn(),
  unlockAudio: vi.fn(),
}));

import { initVolumePage } from '../volume-app.js';
import { unlockAudio, play } from '../volume-audio.js';

function makeTouchStart(target, x = 50, y = 10) {
  const event = new Event('touchstart', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'touches', {
    value: [{ clientX: x, clientY: y }],
    configurable: true,
  });
  target.dispatchEvent(event);
}

describe('volume slider mobile integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="vol-root"></div>';
    vi.clearAllMocks();
  });

  it('unlocks audio and starts playback when the slider is touched on mobile', () => {
    initVolumePage();

    const root = document.getElementById('vol-root');
    const meter = document.getElementById('vol-meter-container');
    expect(root).toBeTruthy();
    expect(meter).toBeTruthy();

    meter.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 20,
      right: 100,
      bottom: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    // Consume the "first interaction" unlock listener so this assertion
    // verifies the dedicated slider-unlock path.
    makeTouchStart(root);
    vi.mocked(unlockAudio).mockClear();

    makeTouchStart(meter, 70, 10);

    expect(unlockAudio).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledTimes(1);
  });
});
