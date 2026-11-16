import { Localized } from '../../i18n/localized';

export interface AboutEntry {
  readonly title: Localized;
  readonly org: Localized;
  readonly period?: Localized;
}

export interface LanguageSkill {
  readonly name: Localized;
  readonly level: Localized;
}

/**
 * Everything shown on the About page. Edit this file to change it.
 * Official course and company names with no `ar` stay in English on the Arabic site.
 * Section headings live in the dictionaries (about.sections).
 */
export const EDUCATION: readonly AboutEntry[] = [
  {
    title: {
      en: "Bachelor's degree in Network Security",
      ar: 'بكالوريوس في أمن الشبكات',
    },
    org: { en: 'Hebron University', ar: 'جامعة الخليل' },
    period: { en: 'Aug 2019 – Jun 2023', ar: 'آب 2019 – حزيران 2023' },
  },
];

export const EXPERIENCE: readonly AboutEntry[] = [
  {
    title: {
      en: 'Administrative Data Entry Assistant (Temporary)',
      ar: 'مساعد إدخال بيانات إداري (مؤقت)',
    },
    org: {
      en: 'Directorate of Education, North Hebron (Halhul)',
      ar: 'مديرية التربية والتعليم شمال الخليل (حلحول)',
    },
    period: { en: 'Nov 2026 – Present', ar: 'تشرين الثاني 2026 – الآن' },
  },
  {
    title: { en: 'Frontend Developer', ar: 'مطوّر واجهات أمامية' },
    org: {
      en: 'Hebron University: “Empowering Journalists to Preserve Palestinian Heritage” project',
      ar: 'جامعة الخليل: مشروع «تمكين الصحفيين من الحفاظ على التراث الفلسطيني»',
    },
    period: { en: 'Jun 2025 – Nov 2025', ar: 'حزيران 2025 – تشرين الثاني 2025' },
  },
  {
    title: { en: 'IT Support Intern', ar: 'متدرّب دعم تقني' },
    org: { en: 'Hebron University', ar: 'جامعة الخليل' },
    period: { en: 'May 2021 – Jul 2021', ar: 'أيار 2021 – تموز 2021' },
  },
  {
    title: { en: 'IT Infrastructure Intern', ar: 'متدرّب بنية تحتية لتقنية المعلومات' },
    org: { en: 'Hebron Electric (Hepco)', ar: 'Hepco' },
    period: { en: 'Apr 2021 – May 2021', ar: 'نيسان 2021 – أيار 2021' },
  },
];

export const CERTIFICATES: readonly AboutEntry[] = [
  {
    title: { en: 'Introduction to Modern AI' },
    org: { en: 'Cisco Networking Academy' },
    period: { en: 'Oct 2026', ar: 'تشرين الأول 2026' },
  },
  {
    title: { en: 'Customer Services' },
    org: { en: 'Alison' },
    period: { en: 'Dec 2025', ar: 'كانون الأول 2025' },
  },
  {
    title: { en: 'Full Stack JavaScript Developer Certificate Nanodegree' },
    org: { en: 'Udacity' },
    period: { en: 'Nov 2025', ar: 'تشرين الثاني 2025' },
  },
  {
    title: { en: 'Introduction to Cybersecurity' },
    org: { en: 'Cisco Networking Academy' },
    period: { en: '2025', ar: '2025' },
  },
  {
    title: { en: 'JournalismAI Discovery course Certificate' },
    org: { en: 'ARIJ Network' },
    period: { en: 'Aug 2025', ar: 'آب 2025' },
  },
];

export const LANGUAGES: readonly LanguageSkill[] = [
  {
    name: { en: 'Arabic', ar: 'العربية' },
    level: { en: 'Native', ar: 'اللغة الأم' },
  },
  {
    name: { en: 'English', ar: 'الإنجليزية' },
    level: { en: 'Upper-intermediate', ar: 'متوسط متقدم' },
  },
];
