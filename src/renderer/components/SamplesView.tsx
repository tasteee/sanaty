import { SampleResultsList } from './AssetResultsList'
import { SearchControls } from './SearchControls'
import { View } from './View'

export const SamplesView = () => {
  return (
    <>
      <View id="SamplesView" className="SamplesView">
        <View.Heading title="Samples" iconName="material-symbols-light:audio-file-rounded"></View.Heading>
        <SearchControls />
        <SampleResultsList key="SamplesView" />
      </View>
    </>
  )
}
