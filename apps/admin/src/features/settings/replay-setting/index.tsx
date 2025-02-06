import ContentSection from '../components/content-section'
import { ReplaySettingForm } from './replay-setting-form.tsx'

export default function SettingsReplay() {
  return (
    <ContentSection
      title='Replay Settings'
      desc="Turn items on or off to control what's sessions replay in the app."
    >
      <ReplaySettingForm />
    </ContentSection>
  )
}
