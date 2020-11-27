Man kann Coder in Encoder und Decoder einteilen:
- Der Decoder liest den Input 
- und der Encoder schreibt den Output

Auf dem Biebertal-Server werden wir später für den Decoder den Standard-Decoder nutzen,
jedoch für den Encoder den h264_nvenc, dieser läuft über die GPU und nicht über die CPU
und ist somit schneller, da die Hardware dafür angepasst ist.

Es gibt auch Coder für die GPU (h264_cuvid und viele andere) diese machen aber nur Sinn, wenn man als Input ein
Video hat. Da wir in unserem Fall aber Images haben, muss dieses Coding auf der CPU stattfinden.

Es gibt viele weitere Einstellungen wie:
- `hwaccel cuvid`: 
Sorgt dafür, dass die dekodierten Frames in der GPU bleiben. Dadurch übernimmt die GPU den gesamten
Rechenaufwand, was sich aber bei uns nicht einsetzen lässt.
- `vsync 0`:
Verhindert das Duplizieren oder Löschen von Frames.
- `c:a copy`: 
Sorgt dafür, dass das Audio nicht neu gerendert wird.

Ein Beispiel für ein komplettes GPU-Rendern wäre folgendes:
`ffmpeg -vsync 0 -hwaccel cuvid -c:v h264_cuvid -i input.mp4 -c:a copy -c:v h264_nvenc  output.mp4`




