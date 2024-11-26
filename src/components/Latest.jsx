import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import theme from '../utils/theme';
import { useState } from 'react';
import Header from './Header';

const articleInfo = [
  {
    tag: 'Giáo Dục',
    title: 'Tương lai của trí tuệ nhân tạo trong giáo dục',
    description:
      'Trí tuệ nhân tạo đang cách mạng hóa ngành giáo dục. Khám phá cách các công cụ dựa trên AI đang cải thiện quy trình giảng dạy và nâng cao chất lượng học tập.',
    authors: [
      {
        name: 'Dương Quốc Bửu',
        avatar:
          'src/assets/userDQB.jpg',
      },
    ],
  },
  {
    tag: 'Định hướng',
    title: 'Phát triển thông qua thiết kế giáo dục lấy người học làm trung tâm',
    description:
      'Phương pháp thiết kế giáo dục lấy người học làm trung tâm đang thúc đẩy sự phát triển đáng kể. Tìm hiểu về các chiến lược chúng tôi áp dụng để tạo ra chương trình học phù hợp với nhu cầu của học viên.',
    authors: [
      {
        name: 'Dương Quốc Bửu',
        avatar:
          'src/assets/userDQB.jpg',
      },
    ],
  },
  {
    tag: 'Kỷ luật',
    title: 'Đón nhận chủ nghĩa tối giản trong thiết kế giáo dục',
    description:
      'Chủ nghĩa tối giản là một xu hướng quan trọng trong thiết kế giáo dục hiện đại. Khám phá cách đội ngũ thiết kế của chúng tôi áp dụng các nguyên tắc tối giản để tạo ra trải nghiệm học tập hiệu quả.',
    authors: [
      {
        name: 'Dương Quốc Bửu',
        avatar:
          'src/assets/userDQB.jpg',
      },
    ],
  },
  {
    tag: 'Đội ngũ chuyên nghiệp',
    title: 'Nuôi dưỡng văn hóa đổi mới trong giáo dục',
    description:
      'Đổi mới là cốt lõi trong văn hóa giáo dục của chúng tôi. Tìm hiểu về các sáng kiến mà chúng tôi triển khai để thúc đẩy sự sáng tạo và phát triển giải pháp giáo dục đột phá.',
    authors: [
      {
        name: 'Dương Quốc Bửu',
        avatar:
          'src/assets/userDQB.jpg',
      },
      {
        name: 'Trevor Henderson',
        avatar:
          'https://firebasestorage.googleapis.com/v0/b/viet-group-net.appspot.com/o/images%2Fimg0297-16547450347881249855508.png?alt=media&token=9b29d6ff-a070-4df0-b415-963beee2b3fa2',
      },
    ],
  },
];

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const TitleTypography = styled(Typography)(() => ({
  position: 'relative',
  textDecoration: 'none',
  '&:hover': { cursor: 'pointer' },
  '& .arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&:hover .arrow': {
    visibility: 'visible',
    opacity: 0.7,
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '3px',
    borderRadius: '8px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: '1px',
    bottom: 0,
    left: 0,
    backgroundColor: theme.green[200],
    opacity: 0.3,
    transition: 'width 0.3s ease, opacity 0.3s ease',
  },
  '&:hover::before': {
    width: '100%',
  },
}));

function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const Latest = () => {
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <div>
      <Header title="Mới nhất" />
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {articleInfo.map((article, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1,
                height: '100%',
              }}
            >
              <Typography gutterBottom variant="caption" component="div">
                {article.tag}
              </Typography>

              <TitleTypography
                gutterBottom
                variant="h6"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? 'Mui-focused' : ''}
              >
                {article.title}
                <NavigateNextRoundedIcon
                  className="arrow"
                  sx={{ fontSize: '1rem' }}
                />
              </TitleTypography>
              <StyledTypography
                variant="body2"
                color={theme.gray[500]}
                gutterBottom
              >
                {article.description}
              </StyledTypography>

              <Author authors={article.authors} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Latest;
