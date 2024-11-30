import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import theme from '../utils/theme';
import { Box, Button, Typography } from '@mui/material';
import typography from '../utils/typography';
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';

const ImageUpload = ({ onImageSelect, defaultImage: defaultImageUrl, isEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (defaultImageUrl) {
      setSelectedImage(defaultImageUrl);
    }
  }, [defaultImageUrl]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring (optional)
        },
        (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
        },
        () => {
          // Upload complete, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setSelectedImage(downloadURL);
            onImageSelect(downloadURL);
            setUploading(false);
          });
        },
      );
    }
  };

  return (
    <div
      style={{
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="icon-button-file"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          sx={{
            borderRadius: '50%',
            backgroundColor: theme.gray[100],
            width: '150px',
            height: '150px',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.primary[100],
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {selectedImage ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                border: '4px solid',
                borderColor: theme.primary[500],
                padding: '5px',
                width: 'max-content',
                height: 'max-content',
              }}
            >
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  borderRadius: '50%',
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : (
            <PhotoCamera sx={{ fontSize: '50px', color: theme.primary[500] }} />
          )}
        </IconButton>

        <Typography
          fontSize={typography.fontSize.sizeM}
          textAlign="center"
          sx={{
            color: theme.primary[500],
            mt: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            '&:hover': {
              color: theme.primary[700],
            },
          }}
        >
          {isEdit ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}
        </Typography>
      </label>
    </div>
  );
};

export default ImageUpload;
