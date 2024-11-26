import * as React from 'react';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';
import theme from '../utils/theme';

const cardData = [
  {
    img: 'https://daotao.sgu.edu.vn/web/images/headers/DSC06478_1.jpg',
    tag: 'Xuất khẩu lao động',
    title: 'Xu hướng xuất khẩu lao động tại Việt Nam',
    description:
      'Khám phá những xu hướng mới nhất trong lĩnh vực xuất khẩu lao động tại Việt Nam, từ nhu cầu lao động đến thị trường tiềm năng ở nước ngoài.',
    authors: [
      { name: 'Nguyễn Văn A', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Trần Thị B', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    img: 'https://uvi.vn/wp-content/uploads/2021/11/DONG-PHUC-DAI-HOC-SAI-GON.jpg',
    tag: 'Đào tạo',
    title: 'Đào tạo kỹ năng cho lao động xuất khẩu',
    description:
      'Chương trình đào tạo kỹ năng cần thiết cho lao động trước khi xuất khẩu, giúp họ tự tin hơn khi làm việc ở nước ngoài.',
    authors: [{ name: 'Lê Minh C', avatar: '/static/images/avatar/3.jpg' }],
  },
  {
    img: 'https://unizone.edu.vn/wp-content/uploads/2019/12/CSVC-SGU-1024x372.jpg',
    tag: 'Cơ hội việc làm',
    title: 'Cơ hội việc làm cho lao động Việt Nam ở nước ngoài',
    description:
      'Tìm hiểu về các cơ hội việc làm hấp dẫn cho lao động Việt Nam tại các quốc gia khác, từ các ngành nghề đến mức lương.',
    authors: [{ name: 'Nguyễn Thị D', avatar: '/static/images/avatar/4.jpg' }],
  },
  {
    img: 'https://unizone.edu.vn/wp-content/uploads/2020/05/sgu.jpg',
    tag: 'Chính sách',
    title: 'Chính sách hỗ trợ lao động xuất khẩu',
    description:
      'Tìm hiểu về các chính sách và quy định hỗ trợ lao động xuất khẩu từ chính phủ Việt Nam nhằm bảo vệ quyền lợi cho người lao động.',
    authors: [{ name: 'Phạm Văn E', avatar: '/static/images/avatar/5.jpg' }],
  },
  {
    img: 'https://vietgroupedu.com.vn/image/cache/data/logo/K%E1%BB%B9%20n%C4%83ng%20m%E1%BB%81m-235x157.jpg',
    tag: 'Kinh nghiệm',
    title: 'Kinh nghiệm sống và làm việc ở nước ngoài',
    description:
      'Chia sẻ những kinh nghiệm thực tế từ những lao động đã làm việc ở nước ngoài, giúp bạn chuẩn bị tốt hơn cho hành trình xuất khẩu lao động.',
    authors: [
      { name: 'Trần Văn F', avatar: '/static/images/avatar/6.jpg' },
      { name: 'Đỗ Thị G', avatar: '/static/images/avatar/7.jpg' },
    ],
  },
  {
    img: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/460576791_1070406825085817_7896790395349637392_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=k_MThUuEz3YQ7kNvgFm1fSy&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=ATqg_leoJlkynKB_ee7YJo7&oh=00_AYBwa00RFWcGf3kQ6i3zKNbCDagSWrnqoCoPGWpviTydfQ&oe=672E756E',
    tag: 'Định hướng',
    title: 'Định hướng nghề nghiệp cho lao động xuất khẩu',
    description: 'Tư vấn về các lựa chọn nghề nghiệp và ngành nghề phù hợp với nhu cầu thị trường lao động quốc tế.',
    authors: [{ name: 'Nguyễn Văn H', avatar: '/static/images/avatar/8.jpg' }],
  },
];

const SyledCard = styled(Card)(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: '#fff',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: theme.green[100],
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const MainContent = () => {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SyledCard
            onFocus={() => handleFocus(0)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[0].img}
              sx={{
                aspectRatio: '16 / 9',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[0].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[0].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[0].description}
              </StyledTypography>
            </SyledCardContent>

            {/* <Author authors={cardData[0].authors} /> */}
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(1)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[1].img}
              aspect-ratio="16 / 9"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[1].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[1].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[1].description}
              </StyledTypography>
            </SyledCardContent>

            {/* <Author authors={cardData[1].authors} /> */}
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(2)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
            sx={{ height: '100%' }}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[2].img}
              sx={{
                height: { sm: 'auto', md: '50%' },
                aspectRatio: { sm: '16 / 9', md: '' },
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[2].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[2].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[2].description}
              </StyledTypography>
            </SyledCardContent>

            {/* <Author authors={cardData[2].authors} /> */}
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(3)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 3 ? 'Mui-focused' : ''}
              sx={{ height: '100%' }}
            >
              <SyledCardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <Typography gutterBottom variant="caption" component="div">
                    {cardData[3].tag}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {cardData[3].title}
                  </Typography>
                  <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {cardData[3].description}
                  </StyledTypography>
                </div>
              </SyledCardContent>

              {/* <Author authors={cardData[3].authors} /> */}
            </SyledCard>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(4)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 4 ? 'Mui-focused' : ''}
              sx={{ height: '100%' }}
            >
              <SyledCardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <Typography gutterBottom variant="caption" component="div">
                    {cardData[4].tag}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {cardData[4].title}
                  </Typography>
                  <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {cardData[4].description}
                  </StyledTypography>
                </div>
              </SyledCardContent>

              {/* <Author authors={cardData[4].authors} /> */}
            </SyledCard>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(5)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 5 ? 'Mui-focused' : ''}
            sx={{ height: '100%' }}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[5].img}
              sx={{
                height: { sm: 'auto', md: '50%' },
                aspectRatio: { sm: '16 / 9', md: '' },
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[5].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[5].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[5].description}
              </StyledTypography>
            </SyledCardContent>

            {/* <Author authors={cardData[5].authors} /> */}
          </SyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContent;
