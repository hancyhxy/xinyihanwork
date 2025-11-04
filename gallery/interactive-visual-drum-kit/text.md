![cover](./public/cover.png)

# Interactive Visual Drum Kit

### Project Brief
- Date: 2025.11
- Project Name: Interactive Visual Drum Kit
- Tag: Hand-gesture Recognition, P5js, Interactive Music
- Classification: Experiential
- Company: UTS

### Concept
The Interactive Visual Drum Kit transforms a webcam and built-in microphone into a playable instrument. Players strike virtual drum pads in mid-air, triggering responsive sound and particle-rich visuals that amplify every motion. The experience is designed for quick onboarding, minimal hardware, and an expressive audiovisual feedback loop.

### Experience Goals
- Deliver a playful, performance-ready interface that works anywhere with just a laptop.
- Fuse motion tracking, percussive audio, and GPU-generated effects so sound and visuals feel inseparable.
- Offer a production-grade demo that can scale into installations, remote jam sessions, or educational tools.

### Gesture-to-Sound Pipeline
#### Stage 1 · Hand Tracking Foundation
- MediaPipe Hands captures both hands with 21 landmarks, outputting clean skeletal overlays.
- Real-time smoothing and coordinate normalization prevent jitter when hands move quickly.

#### Stage 2 · Drum Layout & Hit Logic
- Four drums (Kick, Snare, Tom, Hi-Hat) float in ergonomic positions with hover-state hints.
- A velocity threshold of 500 px/s ensures only intentional strikes trigger a sound.

#### Stage 3 · Audio & Visual Fusion
- The Web Audio API streams low-latency drum samples with per-pad routing.
- Each confirmed hit spawns particle bursts and shader pulses that echo the strike’s direction and intensity.

### System Architecture
![System architecture diagram showing tracking, audio, and shader modules](./public/3-structure.png)

#### Modular Stack
- `tracker.js` wraps MediaPipe inputs and exposes clean hand data for downstream modules.
- `hitmap.js` calculates collision bounds, strike velocity, and cooldown logic per drum.
- `audio.js` manages sample loading, playback envelopes, and optional microphone FFT analysis.
- `sketch.js` orchestrates draw loops, particle systems, and shader uniforms on every frame.

#### Technical Principles
- GPU-first thinking pushes heavy lifting to WebGL shaders, keeping particles lightweight on the CPU.
- Graceful fallback routes to a downsampled 2D canvas when WebGL is unavailable.
- Predictable sequencing keeps the render loop locked to 60 FPS on modern browsers.

### User Journey
![Annotated user journey interface](./public/4-user.png)
First, you grant webcam and microphone permissions. Immediately, you see your hands tracked in real-time with a blue skeletal overlay - your index fingertip becomes your drumstick. As you explore, you can move your hand over the drums without triggering them. To actually play, you need to strike with intent - a fast punching motion. As you build rhythm, the entire scene responds - the background pixelates with the bass, colors shift from cool teals to warm oranges, and the visuals create an immersive musical experience.
#### 1. Grant Permissions
- Players enable webcam and microphone access and see a ready-state indicator.

#### 2. See Your Hands
- A neon skeletal overlay mirrors hand movement so the system feels alive before the first hit.

#### 3. Learn the Pads
- Subtle glow cues on hover reveal drum placement without triggering sound.

#### 4. Strike with Intent
- Fast punches cross the velocity threshold, enlarge the drum’s outline, and play the sample instantly.

#### 5. Jam & Iterate
- Particles explode along the movement vector while shader-driven color shifts react to both gestures and audio energy.

### Visual Feedback System
#### Particle Palette
- Four particle styles—Burst, Spray, Cluster, Ring—map to different playing techniques.
- Shapes span squares, diamonds, crosses, and sparkles with quadratic fade-outs for clarity.

#### Audio-Reactive Shaders
- Bass frequencies modulate pixel size for rhythmic pulsing.
- Energy levels drive palette transitions from deep blues to saturated magenta-pink hues.
- Optional scanlines and posterization filters amplify the retro digital aesthetic.

### Impact & Next Steps
#### Impact Today
- Makes music creation accessible with no peripherals beyond a webcam-enabled laptop.
- Demonstrates a cohesive pipeline where tracking, audio, and GPU shaders reinforce one another.
- Functions as a showcase piece for experiential design and real-time audiovisual systems.

#### Future Exploration
- Expand the drum set, add rhythm scoring, and allow recording/replay for casual players.
- Introduce multiplayer networking for remote jam sessions and collaborative performances.
- Explore VR/AR and full-body tracking to evolve the kit into immersive installations.
