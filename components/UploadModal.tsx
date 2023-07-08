import React, { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUploadModal } from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import uniqid from 'uniqid';
import { useRouter } from 'next/navigation';

export const UploadModal = () => {
  const supabaseClient = useSupabaseClient();
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChange = (open: boolean) => {
    if (!open) {
      // TODO: Reset the form
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // TODO: Upload to supabase
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      // Upload song
      const uniqueId = uniqid();
      const {
        data: songData,
        error: songError
      } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (songError) {
        toast.error('Failed song upload');
      }

      // Upload image
      const {
        data: imageData,
        error: imageError
      } = await supabaseClient.storage
        .from('images')
        .upload(`image-${values.title}-${uniqueId}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (imageError) {
        toast.error('Failed image upload');
      }

      const { error: supabaseError } = await supabaseClient.from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData?.path,
          song_path: songData?.path
        });

      if (supabaseError) {
        toast.error(supabaseError.message);
      }

      router.refresh();
      toast.success('Song created');;
      reset();
      uploadModal.onClose();
    } catch (err) {
      toast.error(`Something went wrong!`);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-y-4'
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />

        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />

        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            className="cursor-pointer"
            {...register('song', { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            className="cursor-pointer"
            {...register('image', { required: true })}
          />
        </div>

        <Button
          disabled={isLoading}
          type="submit"
        >
          Create
        </Button>

      </form>
    </Modal>
  )
}
