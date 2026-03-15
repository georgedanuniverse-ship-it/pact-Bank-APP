from gtts import gTTS
from pydub import AudioSegment
import os

output_dir = "/home/ubuntu/pact_bank_app/audio"
os.makedirs(output_dir, exist_ok=True)

# Define narration segments with their text
narrations = [
    ("01_intro", "Welcome to Pact Bank, Africa's premier digital banking platform. Today we'll walk you through our comprehensive dashboard features for both Personal and Corporate accounts."),
    ("02_login", "Our login experience is tailored to your needs. Personal account holders enjoy a streamlined sign-in process with optional Google authentication. For Corporate clients, we provide a dedicated business portal with enhanced security features designed for enterprise use."),
    ("03_personal_dashboard", "Personal banking made simple. Your dashboard displays your total balance across all accounts, recent transactions, and spending patterns at a glance. Quick action buttons let you instantly transfer funds, pay bills, or add new beneficiaries. Our interactive charts help you visualize your spending by category and track your balance trends over time."),
    ("04_personal_features", "Navigate effortlessly through your transaction history with powerful filters by account, date, and type. The transfers page supports internal, external, and international payments with saved beneficiaries for faster transactions. Your profile keeps all personal information secure and easily manageable."),
    ("05_corporate_intro", "Corporate banking receives a completely transformed experience. The business overview dashboard displays your company's financial health with dedicated quick actions for Payroll, Trade Finance, and comprehensive reporting."),
    ("06_corporate_features", "The Payroll Management module lets you oversee all employees, track monthly salaries, and process payroll with a single click. Trade Finance brings international commerce to your fingertips. Manage letters of credit, bank guarantees, and forex services with real-time tracking of all instruments. Business Reports provide quarterly financial summaries, downloadable income statements, cash flow reports, and balance sheets for informed decision-making."),
    ("07_corporate_profile", "Your Business Profile centralizes all company information including tax ID, registration number, and contact details. Administrators can update business information while maintaining full compliance documentation."),
    ("08_closing", "Pact Bank. Empowering Africa's global rise with world-class banking solutions for individuals and businesses alike.")
]

# Generate individual audio files
audio_files = []
for name, text in narrations:
    filepath = f"{output_dir}/{name}.mp3"
    tts = gTTS(text=text, lang='en', slow=False)
    tts.save(filepath)
    audio_files.append(filepath)
    audio = AudioSegment.from_mp3(filepath)
    print(f"{name}: {len(audio)/1000:.2f}s")

# Concatenate all audio with small pauses
combined = AudioSegment.empty()
for filepath in audio_files:
    audio = AudioSegment.from_mp3(filepath)
    combined += audio + AudioSegment.silent(duration=800)  # 0.8s pause between sections

# Export final voiceover
combined.export(f"{output_dir}/voiceover_full.mp3", format="mp3")
print(f"\nTotal voiceover duration: {len(combined)/1000:.2f}s")
