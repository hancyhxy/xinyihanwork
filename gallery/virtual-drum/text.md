![cover](./public/cover.png)

# Interactive Visual Drum Kit

### Project Brief
- Date: 2025.11
- Project Name: Interactive Visual Drum Kit
- Tag: Interactive Music
- Company: 

### Concept
My Interactive Visual Drum Kit transforms the webcam and microphone into a playable instrument. Instead of hitting a physical drum set, players punch the air and trigger virtual drum pads that respond with synchronized sound and visuals. A 30-second demo video will sit here in the final build to show the system in action, highlighting the gesture-driven controls, the shimmering pixel shader overlay, and the responsive particle bursts.

### Development Journey
#### Stage 1 · Hand Tracking Foundation
- Integrated MediaPipe Hands for two-hand tracking at 21 landmarks each.
- Rendered a skeletal overlay so players immediately see the system responding.

#### Stage 2 · Drum Interface Design
- Placed four drums (Kick, Snare, Tom, Hi-Hat) in ergonomic positions.
- Emphasized hierarchy with larger bass drum visuals for clarity.

#### Stage 3 · Smart Hit Detection
- Calculated fingertip velocity and required 500 px/s to trigger a hit.
- Reduced accidental activations so idle hand motion stays silent.

#### Stage 4 · Gesture-to-Audio Pipeline
- Loaded drum samples through the Web Audio API for low-latency playback.
- Ensured per-drum routing so each gesture routes to the correct sound.

#### Stage 5 · Pixel Effects (Visual Only)
- Launched WebGL shader-driven pixel bursts in orange and pink.
- Added a particle system with four styles that react to impact direction.

#### Stage 6 · Audio-Reactive Visual Layer
- Ran FFT analysis on live audio to link frequency bands to visuals.
- Built two layers: global pixel reactions and a dedicated Hi-Hat glitch.

### Architecture
#### Module Stack
- Webcam feed streams into `tracker.js`, which wraps MediaPipe Hands and normalizes coordinates.
- `sketch.js` orchestrates the render loop, draws the interface, and coordinates particles and shaders.
- `hitmap.js` handles collision detection plus the velocity threshold to confirm intentional hits.
- `audio.js` loads and plays each drum sample with low latency; `sound.js` performs microphone FFT analysis.
- WebGL shaders (`pixelate.vert` / `pixelate.frag`) apply pixelation, color grading, and glitch effects on the GPU.

#### Architectural Principles
- Modular files keep tracking, audio, hit detection, and visuals focused on single responsibilities.
- GPU-first visuals push pixel shaders to handle heavy computation while particles use lightweight physics.
- Graceful fallback routes rendering through a downsampled CPU path when WebGL is unavailable.
- The real-time loop in `sketch.js` orchestrates draw/update steps at 60 FPS with predictable sequencing.

### User Experience Journey
#### 1. Grant Permissions
- Player grants webcam and microphone access and sees a ready state indicator.

#### 2. See Your Hands
- A blue skeletal hand with magenta joints appears; the highlighted index finger becomes the drumstick.

#### 3. Explore the Drums
- Drums glow subtly when a hand hovers above, inviting discovery without sound.

#### 4. Strike with Intent
- Only fast punches exceed the velocity threshold, triggering the drum, enlarging its outline, and playing the sample instantly.

#### 5. Create Your Rhythm
- Players improvise patterns with one or two hands while particles burst along the movement vector.

#### 6. Immersive Experience
- Background pixelation, color shifts, and audio-driven warps intensify with the music’s energy.

### Visual Feedback System
#### Particle System (Keyboard 0–4)
- Burst, Spray, Cluster, and Ring styles cover directional hits, motion-following trails, dense clusters, and expanding waves.
- Shapes include squares, diamonds, crosses, occasional sparkles, and up to 160 particles per drum with quadratic fade-outs.

#### Audio-Reactive Shaders
- Bass controls pixel block size (12→22px) for rhythmic pulsing.
- Energy drives a color palette shift from teal/indigo to pink/orange, with saturation and hue modulation.
- Optional scanlines and posterization amplify the retro digital aesthetic.

#### Hi-Hat Glitch Feature
- Sharp cymbal hits trigger 260–400 ms horizontal bands, pink glitch lines, and displacement for a visual “crash.”

### Impact & Future Potential
#### Impact Today
- Low-barrier music creation that works with just a webcam.
- Gesture-first interface couples playfulness with audiovisual expression.
- Demonstrates real-time performance across tracking, audio, and shader pipelines.

#### Lessons Learned
- Velocity-based detection removed early frustrations from accidental hits.
- Module separation sped up debugging and protected frame rate.
- Shader programming deepened understanding of GPU pipelines.
- Tuning effect intensity required iterative user observation.

#### What’s Next
- Short term: expand the drum set, add rhythm scoring, and enable recording/replay.
- Long term: multiplayer jam sessions, custom sound packs, and AR/VR or full-body tracking adaptations.
- Broader impact: potential for music therapy, interactive installations, remote music education, and live performance tools.
