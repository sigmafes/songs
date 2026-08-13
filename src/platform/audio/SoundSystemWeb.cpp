#include "SoundSystemWeb.h"
#include "../../client/sound/Sound.h"
#include <emscripten.h>

EM_JS(void, web_audio_play_pcm, (const unsigned char* data, int size, int channels, int byteWidth, int rate, float volume, float pitch), {
    if (!Module.webAudioContext) {
        Module.webAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    var context = Module.webAudioContext;
    if (context.state === 'suspended') context.resume();

    var frameSize = channels * byteWidth;
    var frameCount = Math.floor(size / frameSize);
    var audioBuffer = context.createBuffer(channels, frameCount, rate);
    var bytes = HEAPU8.slice(data, data + size);
    var view = new DataView(bytes.buffer);

    for (var channel = 0; channel < channels; ++channel) {
        var output = audioBuffer.getChannelData(channel);
        for (var frame = 0; frame < frameCount; ++frame) {
            var offset = frame * frameSize + channel * byteWidth;
            if (byteWidth === 2) {
                output[frame] = view.getInt16(offset, true) / 32768;
            } else {
                output[frame] = (bytes[offset] - 128) / 128;
            }
        }
    }

    var source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = pitch > 0 ? pitch : 1;
    var gain = context.createGain();
    gain.gain.value = Math.max(0, Math.min(1, volume));
    source.connect(gain);
    gain.connect(context.destination);
    source.start();
});

void SoundSystemWeb::enable(bool status)
{
    if (status) {
        EM_ASM({
            if (Module.webAudioContext && Module.webAudioContext.state === 'suspended') {
                Module.webAudioContext.resume();
            }
        });
    }
}

void SoundSystemWeb::playAt(const SoundDesc& desc, float, float, float, float volume, float pitch)
{
    if (!desc.isValid() || desc.size <= 0) return;
    web_audio_play_pcm(reinterpret_cast<const unsigned char*>(desc.frames), desc.size,
        desc.channels, desc.byteWidth, desc.frameRate, volume, pitch);
}
