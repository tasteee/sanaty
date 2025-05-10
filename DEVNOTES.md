# sanaty devnotes

## Features

### Add folder

User can add a folder for sanaty to index all the samples in it recursively.

### View folders

User can view the folders added and indexed by sanaty.

### Remove folder

User can remove a folder from sanaty (which also removes its samples).

### Create collection

### Delete collection

### Edit collection

### View collection

### Search collection

### Add a sample to a collection

### Remove a sample from a collection

### View all samples

### Search all samples

### Like a sample

### Unlike a sample

### Play a sample

### Copy a sample to clipboard

### Adjust output volume of app

## AssetsView

- Should include filters section
- Should include results section.
- Should include playback bar.
- Should reinstantiate on view change.
- Should share filter and results state with children.

## CollectionView

- Should be AssetsView with CollectionViewHeader.

## CollectionViewHeader

- Shows artwork.
- Shows title.
- Shows description.
- Shows asset count.
- Shows edit icon button.

## CollectionCreateDialog

- Upload artwork.
- Add title.
- Add descripion.
- Create button.
- Cancel button.

## CollectionEditDialog

- Edit artwork.
- Edit title.
- Edit descripion.
- Delete button.
- Cancel button.
- Save button.

## SamplesView

- Filters section.
- Results section.
- Playback bar.

## PlaybackBar

- Folder artwork.
- Name.
- TagsOverview.
- Play button (when not playing).
- Pause button (when playing).
- Previous button.
- Next button.
- Volume slider.

## SampleResultRow

Grid of 3 columns.

### LeftColumn

- Folder artwork.
- When active, play icon on artwork (if not playing).
- When active, pause icon on artwork (if playing).
- When not active but hovered, play icon on artwork.

### MiddleColumn (2 rows)

#### TopRow

- Name.
- Key + Scale together.
- Bpm.
- Length.

#### BottomRow

- AssetTagsOverview

## AssetTagsOverview

Shows two primary tags from each category.
When asset has less than 2 tags for a category,
then the difference is made up by adding to
the number of tags for another category.

- 2 genre tags
- 2 instrument tags
- 2 descriptor tags

For example, if asset has total of 5 genre tags, 2 instrument tags, 1 descriptor tag:

- 2 genre tags
- 3 instrument tags
- 1 descriptor tag

If asset has total 1 genre, 1 instrument, 7 descriptor tags:

- 1 genre tag
- 1 instrument tag
- 4 descriptor tags
