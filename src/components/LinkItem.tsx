import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import useExpire from 'hooks/useExpire';
import {
  handleLinkUrl,
  calcExpirationDate,
  changeToReadableFileSize,
  addCommaToNumber,
  getCurrentUrl,
} from 'utils';
import { EXPIRE, SUBJECTLESS } from 'constants/string';
import type { ApiReturnType } from 'types';
import colors from 'styles/colors';
import styled from 'styled-components';

interface LinksProps {
  link: ApiReturnType;
}

const LinkItem = ({ link }: LinksProps) => {
  const { expire } = useExpire(link);
  const navigate = useNavigate();

  const goToDetailPage = () => {
    navigate(`/${link.key}`);
  };

  const handleReceiver = (emailList: string[]) =>
    emailList.map((email: string, idx: number) => (
      <Avatar text={email} key={idx} />
    ));

  return (
    <TableRow onClick={goToDetailPage}>
      <TableCell>
        <LinkInfo>
          <LinkImage>
            <img
              referrerPolicy="no-referrer"
              src={
                link.thumbnailUrl.slice(-3) !== 'svg'
                  ? link.thumbnailUrl
                  : '/svgs/default.svg'
              }
              alt={link.summary}
            />
          </LinkImage>
          <LinkTexts>
            <LinkTitle>{link.sent ? link.sent.subject : SUBJECTLESS}</LinkTitle>
            <LinkUrl onClick={(e) => handleLinkUrl(e, link)}>
              {expire === EXPIRE ? expire : getCurrentUrl() + link.key}
            </LinkUrl>
          </LinkTexts>
        </LinkInfo>
        <span />
      </TableCell>
      <TableCell>
        <span>파일개수</span>
        <span>{addCommaToNumber(link.count)}</span>
      </TableCell>
      <TableCell>
        <span>파일사이즈</span>
        <span>{changeToReadableFileSize(link.size)}</span>
      </TableCell>
      <TableCell>
        <span>유효기간</span>
        <span>{calcExpirationDate(link.expires_at)}</span>
      </TableCell>
      <TableCell>
        <span>받은사람</span>
        <LinkReceivers>
          {link.sent && handleReceiver(link.sent.emails)}
        </LinkReceivers>
      </TableCell>
    </TableRow>
  );
};

const TableRow = styled.tr`
  color: inherit;
  display: table-row;
  vertical-align: middle;
  outline: 0px;
  font-weight: inherit;
  font-size: inherit;
`;

const TableCell = styled.th`
  font-weight: inherit;
  font-size: inherit;
  font-size: 12px;
  line-height: 24px;
  display: table-cell;
  vertical-align: inherit;
  border-bottom: 1px solid ${colors.grey300};
  text-align: left;
  padding: 16px;
`;

const LinkInfo = styled.div`
  display: flex;
  align-items: center;
`;

const LinkImage = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    border-radius: 4px;
  }
`;

const LinkTexts = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;

  & > * {
    margin: 0;
  }
`;

const LinkTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.grey700};
`;

const LinkUrl = styled.a`
  text-decoration: underline;

  :hover {
    color: ${colors.teal700};
  }
`;

const LinkReceivers = styled.div`
  display: flex;

  & > * + * {
    margin-left: 8px;
  }
`;

export default LinkItem;
