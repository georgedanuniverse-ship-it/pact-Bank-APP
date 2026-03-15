#!/bin/bash
cd /home/ubuntu/pact_bank_app

# Get voiceover duration
VO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio/voiceover_full.mp3)
echo "Voiceover duration: $VO_DURATION seconds"

# Define image to section mapping with durations based on narration
# Total ~160s, 12 images
# Intro (12.4s): image 1 (login personal) - but we need an intro, use image 1
# Login (19.2s): images 1-2 (split ~10s each)
# Personal Dashboard (26.2s): images 3-4 (split ~13s each)
# Personal Features (22s): images 5-7 (split ~7.3s each)
# Corporate Intro (16s): image 8
# Corporate Features (33s): images 9-11 (split ~11s each)
# Corporate Profile (15.5s): image 12
# Closing (9.1s): image 12 continues

# Create input file for concat
cat > concat_list.txt << 'EOF'
file 'segments/seg_01.mp4'
file 'segments/seg_02.mp4'
file 'segments/seg_03.mp4'
file 'segments/seg_04.mp4'
file 'segments/seg_05.mp4'
file 'segments/seg_06.mp4'
file 'segments/seg_07.mp4'
file 'segments/seg_08.mp4'
file 'segments/seg_09.mp4'
file 'segments/seg_10.mp4'
file 'segments/seg_11.mp4'
file 'segments/seg_12.mp4'
EOF

mkdir -p segments

# Image durations (seconds) - distributed to match narration sections
# Total: ~160s for 12 images
DURATIONS=(11 11 13 13 8 8 8 16 11 11 11 19)

IMAGES=(
  "video_assets/01_login_personal.png"
  "video_assets/02_login_corporate.png"
  "video_assets/03_personal_dashboard.png"
  "video_assets/04_personal_charts.png"
  "video_assets/05_personal_transactions.png"
  "video_assets/06_personal_transfers.png"
  "video_assets/07_personal_profile.png"
  "video_assets/08_corporate_dashboard.png"
  "video_assets/09_corporate_payroll.png"
  "video_assets/10_corporate_trade_finance.png"
  "video_assets/11_corporate_reports.png"
  "video_assets/12_corporate_profile.png"
)

# Generate video segments with subtle zoom effect
for i in {0..11}; do
  idx=$((i+1))
  padded=$(printf "%02d" $idx)
  dur=${DURATIONS[$i]}
  img=${IMAGES[$i]}
  
  echo "Creating segment $padded from $img (${dur}s)"
  
  # Create segment with Ken Burns zoom effect (1.0 to 1.05 scale)
  ffmpeg -y -loop 1 -i "$img" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0a3d2e,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$((dur*25)):s=1920x1080:fps=25" -c:v libx264 -t $dur -pix_fmt yuv420p -r 25 "segments/seg_$padded.mp4" 2>/dev/null
done

echo "Concatenating segments..."
ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy video_silent.mp4 2>/dev/null

echo "Video silent duration:"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video_silent.mp4

