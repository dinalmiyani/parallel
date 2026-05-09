import type { Appearance } from '@clerk/nextjs/server';

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#2563EB',
    colorBackground: 'var(--bg-base)',
    colorText: 'var(--text-primary)',
    colorTextSecondary: 'var(--text-secondary)',
    colorInputBackground: 'var(--bg-input)',
    colorInputText: 'var(--text-input)',
    colorNeutral: 'var(--text-secondary)',
    colorDanger: '#f87171',
    colorSuccess: '#34d399',
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '14px',
  },
  elements: {
    card: {
      backgroundColor: 'var(--bg-base)',
      border: '1px solid var(--border)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
    },
    navbar: {
      backgroundColor: 'var(--bg-base)',
      borderColor: 'var(--border)',
    },
    pageScrollBox: { backgroundColor: 'var(--bg-base)' },
    page: { backgroundColor: 'var(--bg-base)' },
    formFieldInput: {
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border)',
      color: 'var(--text-input)',
    },
    socialButtonsBlockButton: {
      backgroundColor: 'var(--bg-raised)',
      border: '1px solid var(--border)',
      color: 'var(--text-primary)',
    },
    dividerLine: { backgroundColor: 'var(--border)' },
    menuList: {
      backgroundColor: 'var(--bg-base)',
      border: '1px solid var(--border)',
    },
    menuItem: {
      backgroundColor: 'var(--bg-base)',
      color: 'var(--text-primary)',
    },
    modalContent: {
      backgroundColor: 'var(--bg-base)',
      border: '1px solid var(--border)',
    },
    selectButton: {
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border)',
      color: 'var(--text-primary)',
    },
    formButtonPrimary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
    },
    footerActionLink: { color: '#60a5fa' },
    footer: { display: 'none' },
    alert: {
      backgroundColor: 'var(--bg-raised)',
      border: '1px solid var(--border)',
    },
  },
};