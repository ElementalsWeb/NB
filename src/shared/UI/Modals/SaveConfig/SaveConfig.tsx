import React, { useState, useEffect } from 'react';
import { LinerWrap } from '../../BaseComponent/GroupComponent/LinerWrap/LinerWrap';
import { InputText } from '../../BaseComponent/InputText/InputText';
import s from './SaveConfig.module.scss';
import { useShare } from '@threekit-tools/treble/dist';
import { CopyIcon } from '../../../assets/svg/CopyIcon';
import { useWindowWidth } from '../../../function/useWindowWidth';
export const SaveConfig = ({ onChange }: any) => {
  const handleShare: any = useShare();
  const [href, setHref] = useState('');
  const windowWidth: any = useWindowWidth();

  useEffect(() => {
    copyFunc();
  }, []);

  async function copyFunc() {
    if (handleShare) {
      const hrefLink = await handleShare();
      setHref(hrefLink);
    }

    // hrefLink.then((res: any) => {
    //   console.log('res: ', res);
    //   const configId = res.split('/?');
    //   const location = window.location.origin;
    //   const result = `${location}?${configId[1]}`;
    // });
  }

  return (
    <div className={s.wrapper}>
      <div className={s.titleWrapper}>
        <div className={s.title}>Save Configuration</div>
        <div className={s.subtitle}>
          Send via email to save / share your current configuration
        </div>
      </div>
      <div className={s.mail}>
        <LinerWrap name={'Enter email'}>
          <InputText onChange={() => {}} placeholder={'example@gmail.com'} />
        </LinerWrap>
      </div>
      <footer>
        <div className={s.text}>
          You can view all the items that you have selected by following the
          link below
        </div>
        <div className={s.copyWrapper}>
          <div className={s.copy}>
            {windowWidth > 710 ? href : 'https://newbalanceteamsports...'}
          </div>
          <div className={s.copyBtn} onClick={() => console.log()}>
            <CopyIcon />
            <span>Copy link</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
