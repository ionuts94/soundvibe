"use client";

import { usePlayer } from '@/hooks/usePlayer';
import React from 'react'

export const Player = () => {
  const player = usePlayer();

  return (
    <div>Player</div>
  )
}
