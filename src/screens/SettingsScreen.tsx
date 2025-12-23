import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const SettingItem = ({
    icon,
    title,
    subtitle,
    hasToggle = false,
    toggleValue = false,
    onToggle,
    onPress,
  }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={hasToggle}>
      <View style={styles.settingContent}>
        <Icon name={icon} size={24} color="#007AFF" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{false: '#e1e1e1', true: '#007AFF'}}
          thumbColor={toggleValue ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Icon name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const SettingSection = ({title, children}: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <SettingSection title="Notifications">
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Get notified about due tasks"
            hasToggle={true}
            toggleValue={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <SettingItem
            icon="volume-high-outline"
            title="Sound"
            subtitle="Play sound with notifications"
            hasToggle={true}
            toggleValue={soundEnabled}
            onToggle={setSoundEnabled}
          />
        </SettingSection>

        <SettingSection title="Appearance">
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            hasToggle={true}
            toggleValue={darkModeEnabled}
            onToggle={setDarkModeEnabled}
          />
          <SettingItem
            icon="color-palette-outline"
            title="Theme Color"
            subtitle="Choose your accent color"
            onPress={() => console.log('Theme color pressed')}
          />
        </SettingSection>

        <SettingSection title="Data">
          <SettingItem
            icon="cloud-outline"
            title="Sync"
            subtitle="Backup and sync your data"
            onPress={() => console.log('Sync pressed')}
          />
          <SettingItem
            icon="download-outline"
            title="Export Data"
            subtitle="Export your tasks and lists"
            onPress={() => console.log('Export pressed')}
          />
        </SettingSection>

        <SettingSection title="Account">
          <SettingItem
            icon="person-outline"
            title="Profile"
            subtitle="Manage your account"
            onPress={() => console.log('Profile pressed')}
          />
          <SettingItem
            icon="key-outline"
            title="Privacy"
            subtitle="Privacy and security settings"
            onPress={() => console.log('Privacy pressed')}
          />
        </SettingSection>

        <SettingSection title="About">
          <SettingItem
            icon="information-circle-outline"
            title="About TickTick Clone"
            subtitle="Version 1.0.0"
            onPress={() => console.log('About pressed')}
          />
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and send feedback"
            onPress={() => console.log('Help pressed')}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  sectionContent: {
    backgroundColor: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e1e1',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingsScreen;