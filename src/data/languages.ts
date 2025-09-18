import { Language } from '@/types'

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isActive: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    isActive: true,
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    isActive: true,
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    isActive: true,
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    isActive: true,
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    isActive: true,
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    isActive: true,
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    isActive: true,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    isActive: true,
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    isActive: true,
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    isActive: true,
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    isActive: true,
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    isActive: true,
  },
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code)
}

export const getActiveLanguages = (): Language[] => {
  return languages.filter(lang => lang.isActive)
}

// Common translations for key UI elements
export const translations = {
  en: {
    welcome: 'Welcome to Psynergy',
    register: 'Register',
    login: 'Login',
    fullName: 'Full Name',
    collegeName: 'College Name',
    usn: 'USN (University Seat Number)',
    yearOfStudy: 'Year of Study',
    email: 'Email Address',
    phoneNumber: 'Phone Number',
    preferredLanguage: 'Preferred Language',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    gender: 'Gender',
    pronouns: 'Pronouns',
    agreeToTerms: 'I agree to the Terms and Conditions',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    forgotPassword: 'Forgot Password?',
    dashboard: 'Dashboard',
    resources: 'Resources',
    support: 'Support',
    community: 'Community',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },
  hi: {
    welcome: 'साइनर्जी में आपका स्वागत है',
    register: 'पंजीकरण करें',
    login: 'लॉगिन',
    fullName: 'पूरा नाम',
    collegeName: 'कॉलेज का नाम',
    usn: 'यूएसएन (विश्वविद्यालय सीट संख्या)',
    yearOfStudy: 'अध्ययन का वर्ष',
    email: 'ईमेल पता',
    phoneNumber: 'फोन नंबर',
    preferredLanguage: 'पसंदीदा भाषा',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    gender: 'लिंग',
    pronouns: 'सर्वनाम',
    agreeToTerms: 'मैं नियम और शर्तों से सहमत हूं',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'क्या आपका पहले से खाता है?',
    signIn: 'साइन इन करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    dashboard: 'डैशबोर्ड',
    resources: 'संसाधन',
    support: 'सहायता',
    community: 'समुदाय',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
  },
  kn: {
    welcome: 'ಸೈನರ್ಜಿಗೆ ಸ್ವಾಗತ',
    register: 'ನೋಂದಣಿ',
    login: 'ಲಾಗಿನ್',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    collegeName: 'ಕಾಲೇಜಿನ ಹೆಸರು',
    usn: 'ಯುಎಸ್‌ಎನ್ (ವಿಶ್ವವಿದ್ಯಾಲಯ ಸೀಟ್ ಸಂಖ್ಯೆ)',
    yearOfStudy: 'ಅಧ್ಯಯನದ ವರ್ಷ',
    email: 'ಇಮೇಲ್ ವಿಳಾಸ',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    preferredLanguage: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    gender: 'ಲಿಂಗ',
    pronouns: 'ಸರ್ವನಾಮಗಳು',
    agreeToTerms: 'ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪುತ್ತೇನೆ',
    createAccount: 'ಖಾತೆ ರಚಿಸಿ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?',
    signIn: 'ಸೈನ್ ಇನ್',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    resources: 'ಸಂಪನ್ಮೂಲಗಳು',
    support: 'ಬೆಂಬಲ',
    community: 'ಸಮುದಾಯ',
    profile: 'ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout: 'ಲಾಗ್‌ಔಟ್',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    lightMode: 'ಲೈಟ್ ಮೋಡ್',
  },
}

export const getTranslation = (key: string, languageCode: string = 'en'): string => {
  const langTranslations = translations[languageCode as keyof typeof translations]
  return langTranslations?.[key as keyof typeof langTranslations] || translations.en[key as keyof typeof translations.en] || key
}
