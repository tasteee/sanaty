import {
  Box,
  Flex,
  Button,
  Portal,
  ProgressCircle,
  IconButton,
  Text,
  Tag,
  Menu,
  useColorModeValue,
  CuteIcon
} from '#/components'
import { Card } from '#/components'
import { $assets } from '#/stores/assets'

export const AssetResultsList = () => {
  const assetsList = $assets.list.use()

  return (
    <Flex className="AssetResultsList customScrollbar" direction="column" gap="2" padding="2" overflowY="auto" flex="1">
      {assetsList.map((asset) => {
        return <AssetRow key={asset.id} id={asset.id} isActive={false} />
      })}
    </Flex>
  )
}

export const AssetRow = ({ id, isActive }: { id: string; isActive: boolean }) => {
  const asset = $assets.useAsset(id)
  //   const cardBg = useColorModeValue('gray.50', 'gray.700')
  const glowColor = 'pink.400'
  const color = asset.isLiked ? 'pink' : 'gray'
  const heartButtonVariant = asset.isLiked ? 'surface' : 'outline'

  const toggleAssetLiked = async () => {
    const newAsset = await window.electron.toggleAssetLiked(asset.id)
    $assets.setAssetLiked(id, newAsset.isLiked)
  }

  return (
    <Card.Root
      className="AssetRow"
      size="sm"
      borderRadius="lg"
      position="relative"
      _before={
        isActive
          ? {
              content: '""',
              position: 'absolute',
              top: '-4px',
              bottom: '-4px',
              left: '-4px',
              right: '-4px',
              bgGradient: `linear(to-r, ${glowColor}, transparent, ${glowColor})`,
              borderRadius: 'lg',
              zIndex: 0,
              filter: 'blur(8px)',
              animation: 'pulseGlow 4s infinite'
            }
          : {}
      }
    >
      <Card.Body zIndex={1} position="relative">
        <Flex align="center" gap="4">
          {/* Play Icon */}
          <Box
            bg="gray.600"
            boxSize="40px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <CuteIcon name="play" />
          </Box>

          {/* Info Block */}
          <Flex direction="column" flex="1" justify="center">
            <Flex gap="4" align="center">
              <Text fontWeight="bold">{asset.name}</Text>
              <Flex fontSize="sm" color="gray.500" gap="4">
                <Text>{asset.key}</Text>
                <Text>{asset.scale}</Text>
                <Text>{asset.bpm} BPM</Text>
                <Text>{asset.length}s</Text>
              </Flex>
            </Flex>
            <Flex mt="1" gap="1">
              <Tag.Root size="md" colorPalette="gray">
                <Tag.Label>808</Tag.Label>
              </Tag.Root>

              <Tag.Root size="md" colorPalette="gray">
                <Tag.Label>Acoustic</Tag.Label>
              </Tag.Root>

              <Tag.Root size="md" colorPalette="gray">
                <Tag.Label>Loop</Tag.Label>
              </Tag.Root>
            </Flex>
          </Flex>

          <Flex gap="2" align="flex-end" ml="2">
            <IconButton onClick={toggleAssetLiked} colorPalette={color} variant={heartButtonVariant}>
              <CuteIcon name="heart" />
            </IconButton>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="outline">
                  <CuteIcon name="more-3" />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="settings">Settings</Menu.Item>
                    <Menu.Item value="support">Support</Menu.Item>
                    <Menu.Item value="addFolder">Add Folder</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

console.log({ Portal, Menu, Text, Flex })
