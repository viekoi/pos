'use client'
import UploadMediaForm from '@/components/forms/upload-media-form'
import CustomModal from '@/components/modals/custom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { Media } from '@prisma/client'
import React from 'react'




const MediaUploadButton = () => {
  const { isOpen, setOpen, setClose } = useModal()

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm />
          </CustomModal>
        )
      }}
    >
      Upload
    </Button>
  )
}

export default MediaUploadButton
