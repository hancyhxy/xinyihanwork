![cover](./public/cover.png)

# Interactive Visual Drum Kit

### Project Brief
- Date: 2025.11
- Project Name: Interactive Visual Drum Kit
- Tag: Hand-gesture Recognition, P5js, Interactive Music
- Classification: Experiential
- Company: UTS

### Concept
My project is an Interactive Visual Drum Kit that transforms your webcam into a musical instrument. 
Instead of using a mouse or keyboard, you play drums by moving your hands through virtual drum pads. 
The system combines hand tracking with audio-reactive  pixel visual effects, creating an immersive experience where every gesture produces both sound and dynamic visuals.

#### Experience Goals
- Deliver a playful, performance-ready interface that works anywhere with just a laptop.
- Fuse motion tracking, percussive audio, and GPU-generated effects so sound and visuals feel inseparable.
- Offer a production-grade demo that can scale into installations, remote jam sessions, or educational tools.

#### Gesture-to-Sound Pipeline
**Stage 1 · Hand Tracking Foundation**
- MediaPipe Hands captures both hands with 21 landmarks, outputting clean skeletal overlays.
- Real-time smoothing and coordinate normalization prevent jitter when hands move quickly.
**Stage 2 · Drum Layout & Hit Logic**
- Four drums (Kick, Snare, Tom, Hi-Hat) float in ergonomic positions with hover-state hints.
- A velocity threshold of 500 px/s ensures only intentional strikes trigger a sound.
**Stage 3 · Audio & Visual Fusion**
- The Web Audio API streams low-latency drum samples with per-pad routing.
- Each confirmed hit spawns particle bursts and shader pulses that echo the strike’s direction and intensity.

### System Architecture
![System architecture diagram showing tracking, audio, and shader modules](./public/3-structure.png)


### User Journey
First, you grant webcam and microphone permissions. Immediately, you see your hands tracked in real-time with a blue skeletal overlay - your index fingertip becomes your drumstick. As you explore, you can move your hand over the drums without triggering them. To actually play, you need to strike with intent - a fast punching motion. As you build rhythm, the entire scene responds - the background pixelates with the bass, colors shift from cool teals to warm oranges, and the visuals create an immersive musical experience.
![Annotated user journey interface](./public/4-user.png)


### Show Case

open the link to experience 👏 （allow the camera and microphone permissions）https://hancyhxy.github.io/virtual_band/


### Impact, Learning & Future Potential
![Impact & Next Steps](./public/6-impact.png)