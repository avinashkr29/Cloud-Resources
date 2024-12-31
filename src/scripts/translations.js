const translations = {
    en: {
        nav: {
            features: "Features",
            download: "Download",
            contact: "Contact",
            privacy: "Privacy"
        },
        hero: {
            subtitle: "Your Personal Time Announcer",
            description: "Stay on schedule with elegant time announcements. Perfect for productivity, accessibility, and maintaining time awareness throughout your day.",
            downloadNow: "Download Now",
            learnMore: "Learn More"
        },
        benefits: {
            title: "How Talking Clock Pro Enhances Your Day",
            professionalsTitle: "For Professionals",
            professionalsList: [
                "Stay on schedule during meetings",
                "Time-block your work effectively",
                "Maintain productivity awareness"
            ],
            accessibilityTitle: "For Accessibility Users",
            accessibilityList: [
                "Clear voice announcements",
                "Customizable speaking speed",
                "Multiple language support"
            ],
            studentsTitle: "For Students",
            studentsList: [
                "Track study sessions",
                "Manage exam time effectively",
                "Stay focused with time checks"
            ]
        },
        features: {
            title: "Key Features",
            clockStyle: {
                h3: "Multiple Clock Styles",
                p: "Choose from minimal, classic, modern, or digital display styles"
            },
            voiceCustomization: {
                h3: "Voice Customization",
                p: "Adjust speed, volume, and select from multiple languages"
            },
            intervals: {
                h3: "Flexible Intervals",
                p: "Set custom announcement intervals from 1 minute to 1 hour"
            },
            quietHours: {
                h3: "Quiet Hours",
                p: "Set specific hours when announcements should be silenced"
            }
        },
        contact: {
            title: "Contact Us",
            description: "Have questions or feedback? We'd love to hear from you!",
            emailUs: "Email Us",
            followUs: "Follow Us"
        },
        privacy: {
            title: "Privacy Policy",
            commitment: "At Talking Clock Pro, we are committed to protecting your privacy and ensuring complete transparency about our data practices.",
            intro: "Talking Clock Pro respects your privacy. The app only requires:",
            audioPermission: "Audio permissions for announcements",
            backgroundPermission: "Background operation permission for continuous functionality",
            dataPolicy: "No personal data is collected or shared with third parties."
        }
    },
    ja: {
        nav: {
            features: "機能",
            download: "ダウンロード",
            contact: "お問い合わせ",
            privacy: "プライバシー"
        },
        hero: {
            subtitle: "あなたの個人的な時間アナウンサー",
            description: "エレガントな時間アナウンスで予定通りに。生産性、アクセシビリティ、そして一日を通じての時間認識に最適です。",
            downloadNow: "今すぐダウンロード",
            learnMore: "詳細を見る"
        },
        benefits: {
            title: "Talking Clock Proがあなたの一日をより良くする方法",
            professionalsTitle: "プロフェッショナルの方へ",
            professionalsList: [
                "会議中のスケジュール管理",
                "効果的な時間ブロッキング",
                "生産性の意識を維持"
            ],
            accessibilityTitle: "アクセシビリティユーザーの方へ",
            accessibilityList: [
                "クリアな音声アナウンス",
                "カスタマイズ可能な話速",
                "多言語サポート"
            ],
            studentsTitle: "学生の方へ",
            studentsList: [
                "学習セッションの記録",
                "試験時間の効果的な管理",
                "時間チェックで集中力を維持"
            ]
        },
        features: {
            title: "主な機能",
            clockStyle: {
                h3: "複数の時計スタイル",
                p: "ミニマル、クラシック、モダン、デジタル表示から選択可能"
            },
            voiceCustomization: {
                h3: "音声カスタマイズ",
                p: "速度、音量の調整と複数言語からの選択が可能"
            },
            intervals: {
                h3: "柔軟な間隔設定",
                p: "1分から1時間までのカスタム通知間隔を設定"
            },
            quietHours: {
                h3: "静音時間",
                p: "通知を停止する特定の時間帯を設定"
            }
        },
        contact: {
            title: "お問い合わせ",
            description: "ご質問やフィードバックをお待ちしております！",
            emailUs: "メールを送る",
            followUs: "フォローする"
        },
        privacy: {
            title: "プライバシーポリシー",
            commitment: "Talking Clock Proは、お客様のプライバシーを保護し、データ取り扱いについて完全な透明性を確保することを約束します。",
            intro: "Talking Clock Proはあなたのプライバシーを尊重します。アプリに必要な権限は以下のみです：",
            audioPermission: "アナウンスのための音声権限",
            backgroundPermission: "継続的な機能のためのバックグラウンド動作権限",
            dataPolicy: "個人データの収集や第三者との共有は行いません。"
        }
    }
};

// Language toggle function
function toggleLanguage() {
    const currentLang = document.documentElement.lang || 'en';
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    
    // Update content with new language
    updateContent(newLang);
    
    // Update toggle button text
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = newLang === 'en' ? '日本語' : 'English';
    }
    
    // Save language preference
    localStorage.setItem('preferredLanguage', newLang);
}

// Content update function
function updateContent(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not found in translations`);
        return;
    }

    const content = translations[lang];
    
    // Update document language
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        try {
            const keys = key.split('.');
            let value = content;
            
            for (const k of keys) {
                value = value[k];
                if (value === undefined) throw new Error(`Translation not found for key: ${key}`);
            }
            
            if (element.tagName === 'INPUT') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        } catch (error) {
            console.error(`Error updating translation for key ${key}:`, error);
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Initialize content with saved language
    updateContent(savedLang);
    
    // Update toggle button text
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = savedLang === 'en' ? '日本語' : 'English';
    }
    
    // Add click event listener to language toggle button
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }
});