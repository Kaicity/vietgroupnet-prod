import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  line-height: 1.5715;
`;

const Label = styled.span`
  display: inline-block;
  margin-inline-end: 8px;
  color: rgba(0, 0, 0, 0.85);
`;

const DescriptionItem = ({ title, content }) => (
  <Wrapper className="site-description-item-profile-wrapper">
    <Label className="site-description-item-profile-p-label">{title}:</Label>
    {content}
  </Wrapper>
);

export default DescriptionItem;
