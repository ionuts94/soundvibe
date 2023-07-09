"use client";
import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import React from 'react'
import { useAuthModal } from '@/hooks/useAuthModal';
import { useUploadModal } from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { MediaItem } from './MediaItem';
import { Song } from '@/types';

interface LibraryProps {
  userSongs: Song[];
}

export const Library: React.FC<LibraryProps> = ({ userSongs }) => {
  const authModal = useAuthModal();
  const { user } = useUser();
  const uploadModal = useUploadModal();

  const onClick = () => {
    // Open login modal if user press '+' on library 
    // And they are not logged in
    if (!user) {
      return authModal.onOpen();
    }

    // TODO: Check for subscription

    return uploadModal.onOpen();
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">
            Your Library
          </p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>

      <div className='flex flex-col gap-y-2 mt-4 px-3'>
        {userSongs?.map(song => (
          <MediaItem
            key={song.id}
            onClick={() => null}
            data={song}
          />
        ))}
      </div>
    </div>
  )
}