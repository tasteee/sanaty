import { SampleResultsList } from './SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from './SamplesResultsView/SearchFilterSection/TagCloudHeader'
import { SearchControls } from '../SearchControls'
import { View } from '../View'

export const SamplesView = () => {
  return (
    <>
      <View id="SamplesView" className="SamplesView">
        <View.Heading title="Samples" iconName="material-symbols-light:audio-file-rounded">
          <SearchControls />
        </View.Heading>
        <SampleResultsList key="SamplesView" />
      </View>
    </>
  )
}
