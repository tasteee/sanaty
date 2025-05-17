import fs from 'fs'
import path from 'path'
import * as crypto from 'crypto'
import * as Meyda from 'meyda'
import range from 'array-range'
import random from 'just-random'
import { TAGS } from '#/constants'
import * as mm from '../../node_modules/music-metadata/lib/index'
import { IS_DEV_ENV } from './constants'
import decode from 'audio-decode'
const Essentia = require('essentia.js')

const essentiaInstance = new Essentia.Essentia(Essentia.EssentiaWASM, IS_DEV_ENV)

function getRandomTag() {
  return random(TAGS.LIST)
}

function getRandomSampletype() {
  return random(['shot', 'loop'])
}

function getRandomTags() {
  return [getRandomTag().id, getRandomTag().id, getRandomTag().id, getRandomTag().id, getRandomTag().id]
}

/**
 * Analyze waveform to detect loop characteristics
 */
function analyzeWaveformForLoopCharacteristics(audioData, sampleRate: number): boolean {
  // 1. Check if the start and end of the audio file have similar waveforms
  const analysisDuration = Math.min(0.2, audioData.length / sampleRate / 4) // 200ms or 1/4 of file, whichever is smaller
  const samplesForAnalysis = Math.floor(analysisDuration * sampleRate)

  if (audioData.length < samplesForAnalysis * 2) {
    return false // Too short to be a loop
  }

  const startSection = audioData.slice(0, samplesForAnalysis)
  const endSection = audioData.slice(audioData.length - samplesForAnalysis)

  // Calculate similarity between start and end sections
  let similarity = calculateWaveformSimilarity(startSection, endSection)

  // 2. Check for repeating patterns throughout the audio
  const hasRepeatingPatterns = detectRepeatingPatterns(audioData, sampleRate)

  // Classify as a loop if similarity is high or has repeating patterns
  return similarity > 0.75 || hasRepeatingPatterns
}

/**
 * Calculate similarity between two waveform sections
 */
function calculateWaveformSimilarity(section1: Float32Array, section2: Float32Array): number {
  if (section1.length !== section2.length) {
    return 0
  }

  // Calculate cross-correlation
  let sumXY = 0
  let sumX2 = 0
  let sumY2 = 0

  for (let i = 0; i < section1.length; i++) {
    sumXY += section1[i] * section2[i]
    sumX2 += section1[i] * section1[i]
    sumY2 += section2[i] * section2[i]
  }

  if (sumX2 === 0 || sumY2 === 0) return 0

  return sumXY / Math.sqrt(sumX2 * sumY2)
}

/**
 * Detect repeating patterns in audio
 */
function detectRepeatingPatterns(audioData: Float32Array, sampleRate: number): boolean {
  // Simplification: Instead of implementing a full repeating pattern detection algorithm,
  // we'll use a simplified approach checking energy distribution

  // Divide the audio into equal parts
  const numParts = 4
  const partLength = Math.floor(audioData.length / numParts)

  const energyPerPart = []

  // Calculate energy for each part
  for (let i = 0; i < numParts; i++) {
    const start = i * partLength
    const end = start + partLength
    let energy = 0

    for (let j = start; j < end && j < audioData.length; j++) {
      energy += audioData[j] * audioData[j]
    }

    energyPerPart.push(energy / partLength)
  }

  // Calculate similarity between adjacent parts
  let similarParts = 0
  for (let i = 0; i < energyPerPart.length - 1; i++) {
    const ratio = energyPerPart[i] / energyPerPart[i + 1]
    if (ratio > 0.8 && ratio < 1.2) {
      similarParts++
    }
  }

  // If more than half the parts are similar, it's likely a repeating pattern
  return similarParts >= Math.floor(numParts / 2)
}

/**
 * Get random tonic as a fallback
 */
function getRandomTonic(): string {
  const tonics = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  return tonics[Math.floor(Math.random() * tonics.length)]
}

/**
 * Get random scale as a fallback
 */
function getRandomScale(): string {
  const scales = ['major', 'minor']
  return scales[Math.floor(Math.random() * scales.length)]
}

export const parseSample = async (filePath, folderId) => {
  const stats = fs.statSync(filePath)
  const extension = path.extname(filePath).toLowerCase()
  const fileName = path.basename(filePath, extension)
  const fullName = path.basename(filePath)
  const metadata = await mm.parseFile(filePath)
  const sampleRate = metadata.format.sampleRate || 44100
  const buffer = fs.readFileSync(filePath)
  //   const audioDecoded = await decode(buffer)
  const tonic = 'C' // keyResult.key // e.g., "C", "F#"
  const scale = 'Minor' // keyResult.scale
  const bpm = 93
  const isLoop = analyzeWaveformForLoopCharacteristics(buffer, sampleRate)
  const duration = Math.ceil(metadata.format.duration || 0)
  // console.log({ isLoop, duration, tonic, scale, sampleRate, bpm })

  const sample: SampleT = {
    id: filePath,
    fullName,
    name: fileName,
    path: filePath,
    size: stats.size,
    extension: extension.substring(1),
    folderId,
    duration,
    bpm,
    tonic,
    scale,
    sampleType: isLoop ? 'loop' : 'shot',
    tags: getRandomTags(),
    dateAdded: Date.now()
  }

  return sample
}
