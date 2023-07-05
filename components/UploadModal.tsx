import React, { useState } from 'react'
import { Modal } from './Modal'
import { useUploadModal } from '@/hooks/useUploadModal'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import { Input } from './Input'

export const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      // TODO: Reset the form
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // TODO: Upload to supabase
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
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />

      </form>
    </Modal>
  )
}
