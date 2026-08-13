#ifndef SoundSystemWeb_H__
#define SoundSystemWeb_H__

#include "SoundSystem.h"

class SoundSystemWeb : public SoundSystem
{
public:
    bool isAvailable() override { return true; }
    void enable(bool status) override;
    void playAt(const SoundDesc& desc, float x, float y, float z, float volume, float pitch) override;
};

#endif
