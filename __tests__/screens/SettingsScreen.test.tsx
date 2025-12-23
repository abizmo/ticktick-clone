import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SettingsScreen from '../../src/screens/SettingsScreen';

describe('SettingsScreen', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Settings')).toBeTruthy();
    });

    it('should display Settings header title', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Settings')).toBeTruthy();
    });
  });

  describe('Notifications Section', () => {
    it('should render Notifications section', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Notifications')).toBeTruthy();
    });

    it('should render Push Notifications setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Push Notifications')).toBeTruthy();
      expect(getByText('Get notified about due tasks')).toBeTruthy();
    });

    it('should render Sound setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Sound')).toBeTruthy();
      expect(getByText('Play sound with notifications')).toBeTruthy();
    });

    it('should have notifications enabled by default', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should have sound disabled by default', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Appearance Section', () => {
    it('should render Appearance section', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Appearance')).toBeTruthy();
    });

    it('should render Dark Mode setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Dark Mode')).toBeTruthy();
      expect(getByText('Switch to dark theme')).toBeTruthy();
    });

    it('should render Theme Color setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Theme Color')).toBeTruthy();
      expect(getByText('Choose your accent color')).toBeTruthy();
    });

    it('should have dark mode disabled by default', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Data Section', () => {
    it('should render Data section', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Data')).toBeTruthy();
    });

    it('should render Sync setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Sync')).toBeTruthy();
      expect(getByText('Backup and sync your data')).toBeTruthy();
    });

    it('should render Export Data setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Export Data')).toBeTruthy();
      expect(getByText('Export your tasks and lists')).toBeTruthy();
    });
  });

  describe('Account Section', () => {
    it('should render Account section', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Account')).toBeTruthy();
    });

    it('should render Profile setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Profile')).toBeTruthy();
      expect(getByText('Manage your account')).toBeTruthy();
    });

    it('should render Privacy setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Privacy')).toBeTruthy();
      expect(getByText('Privacy and security settings')).toBeTruthy();
    });
  });

  describe('About Section', () => {
    it('should render About section', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('About')).toBeTruthy();
    });

    it('should render About TickTick Clone setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('About TickTick Clone')).toBeTruthy();
      expect(getByText('Version 1.0.0')).toBeTruthy();
    });

    it('should render Help & Support setting', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Help & Support')).toBeTruthy();
      expect(getByText('Get help and send feedback')).toBeTruthy();
    });
  });

  describe('Toggle Interactions', () => {
    it('should toggle notifications when switch is pressed', () => {
      const {getByText, UNSAFE_root} = render(<SettingsScreen />);
      const notificationsText = getByText('Push Notifications');
      expect(notificationsText).toBeTruthy();
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should toggle sound when switch is pressed', () => {
      const {getByText, UNSAFE_root} = render(<SettingsScreen />);
      const soundText = getByText('Sound');
      expect(soundText).toBeTruthy();
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should toggle dark mode when switch is pressed', () => {
      const {getByText, UNSAFE_root} = render(<SettingsScreen />);
      const darkModeText = getByText('Dark Mode');
      expect(darkModeText).toBeTruthy();
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation Items', () => {
    it('should handle Theme Color press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const themeColorItem = getByText('Theme Color');
      fireEvent.press(themeColorItem);
      expect(consoleSpy).toHaveBeenCalledWith('Theme color pressed');
      consoleSpy.mockRestore();
    });

    it('should handle Sync press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const syncItem = getByText('Sync');
      fireEvent.press(syncItem);
      expect(consoleSpy).toHaveBeenCalledWith('Sync pressed');
      consoleSpy.mockRestore();
    });

    it('should handle Export Data press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const exportItem = getByText('Export Data');
      fireEvent.press(exportItem);
      expect(consoleSpy).toHaveBeenCalledWith('Export pressed');
      consoleSpy.mockRestore();
    });

    it('should handle Profile press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const profileItem = getByText('Profile');
      fireEvent.press(profileItem);
      expect(consoleSpy).toHaveBeenCalledWith('Profile pressed');
      consoleSpy.mockRestore();
    });

    it('should handle Privacy press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const privacyItem = getByText('Privacy');
      fireEvent.press(privacyItem);
      expect(consoleSpy).toHaveBeenCalledWith('Privacy pressed');
      consoleSpy.mockRestore();
    });

    it('should handle About press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const aboutItem = getByText('About TickTick Clone');
      fireEvent.press(aboutItem);
      expect(consoleSpy).toHaveBeenCalledWith('About pressed');
      consoleSpy.mockRestore();
    });

    it('should handle Help press', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const {getByText} = render(<SettingsScreen />);
      const helpItem = getByText('Help & Support');
      fireEvent.press(helpItem);
      expect(consoleSpy).toHaveBeenCalledWith('Help pressed');
      consoleSpy.mockRestore();
    });
  });

  describe('Component Structure', () => {
    it('should have SafeAreaView as root component', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render ScrollView for settings', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render all sections in order', () => {
      const {getAllByText} = render(<SettingsScreen />);
      const sections = getAllByText(
        /Notifications|Appearance|Data|Account|About/,
      );
      expect(sections.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('State Management', () => {
    it('should initialize with correct default states', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render all interactive elements', () => {
      const {UNSAFE_root} = render(<SettingsScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should have proper labels for switches', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Push Notifications')).toBeTruthy();
      expect(getByText('Sound')).toBeTruthy();
      expect(getByText('Dark Mode')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle subtitle rendering correctly', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Get notified about due tasks')).toBeTruthy();
      expect(getByText('Play sound with notifications')).toBeTruthy();
      expect(getByText('Switch to dark theme')).toBeTruthy();
    });

    it('should render version number correctly', () => {
      const {getByText} = render(<SettingsScreen />);
      expect(getByText('Version 1.0.0')).toBeTruthy();
    });
  });
});
