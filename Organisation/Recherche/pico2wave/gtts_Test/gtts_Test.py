from gtts import gTTS
import os
# deutsch
fd = open('test.txt')
xd = fd.read()
language = 'de'
audio = gTTS(text=xd, lang=language, slow=False)
audio.save("test.wav")
# englisch
fe = open('test_en.txt')
xe = fe.read()
language = 'en'
audio = gTTS(text=xe, lang=language, slow=False)
audio.save("test_en.wav")
