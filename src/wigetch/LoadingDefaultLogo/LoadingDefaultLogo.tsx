import s from './LoadingDefaultLogo.module.scss';
import { useState } from 'react';
import { IconPlus } from '../../shared/assets/svg/IconPlus';
import { ViewLoadImg } from '../../shared/UI/BaseComponent/ViewLoadImg/ViewLoadImg';
import { LoaderWrap } from '../../shared/UI/LoaderWrap.tsx/LoaderWrap';
import { OverlayingPopup } from '../../shared/UI/BaseComponent/OverlayingPopup/OverlayingPopup';
import { ModalsWrap } from '../../shared/UI/BaseComponent/ModalsWrap/ModalsWrap';
import {
  DefaultGraphics,
  listDefaultGraphicsImg,
} from '../../shared/UI/Modals/DefaultGraphics/DefaultGraphics';
import { useDispatch } from 'react-redux';
import {
  setCurentLayer,
  setThreekitAttribute,
} from '../../shared/function/providers/redax/action';
import { useSelector } from 'react-redux';
import { getLoadersName } from '../../shared/function/providers/redax/selectore';
import { useConfigurator } from '@threekit-tools/treble/dist';

export const getDefaultIcon = (value: string) => {
  console.log('listDefaultGraphicsImg', listDefaultGraphicsImg);
  console.log('value getDefaultIcon', value);

  return listDefaultGraphicsImg.find((img) => img['nameThreekit'] === value);
};

export const LoadingDefaultLogo = ({ zoneLogo }: any) => {
  const [openDefaultGrafic, setOpenDefaultGrafic] = useState(false);
  const [selectedDefaultGrafic, setSelectedDefaultGrafic] = useState(undefined);
  const [confirmDefaultGrafic, setConfirmDefaultGrafic] = useState(undefined);

  const loadCustomImg = useSelector(getLoadersName('loadCustomImg'));
  const loadChangeThreekit = useSelector(getLoadersName('loadChangeThreekit'));

  const [attributes, setConfiguration]: any = useConfigurator();

  const dispatch = useDispatch();
  if (!attributes) return <></>;

  const showModal = () => {
    setOpenDefaultGrafic(true);
    setSelectedDefaultGrafic(undefined);
  };

  const RemoteDefaultLogogThreekit = async () => {
    dispatch(setThreekitAttribute(true));
    dispatch(
      setCurentLayer({
        type: 'default-graphic',
      })
    );
    setConfirmDefaultGrafic(undefined);
    const nameAttr = `Add Logo ${zoneLogo}`;
    await setConfiguration({ [nameAttr]: { assetId: '' } });
    //@ts-ignore
    await window.threekit.player.evaluate();
    await dispatch(setThreekitAttribute(false));
  };
  const setDefaultLogogThreekit = async (nameThreekit: string) => {
    console.log('attributes', attributes);
    dispatch(
      setCurentLayer({
        type: 'default-graphic',
      })
    );
    const nameAttr = `Add Logo ${zoneLogo}`;

    let attr = Object.values(attributes).find((attr: any) =>
      attr['name'].includes(nameAttr)
    );
    if (!attr) return;
    //@ts-ignore
    if (attr['values'].length < 1) return;
    //@ts-ignore
    const value = attr['values'].find(
      (value: any) => value['name'] === nameThreekit
    );

    await setConfiguration({ [nameAttr]: value });
    //@ts-ignore
    await window.threekit.player.evaluate();
  };

  const IconInfo = confirmDefaultGrafic
    ? getDefaultIcon(confirmDefaultGrafic)
    : undefined;

  if (loadCustomImg) return <></>;

  return (
    <>
      {!confirmDefaultGrafic && (
        <div className={s.box}>
          <div onClick={() => showModal()} className={s.btn_default}>
            <span>
              <IconPlus />
            </span>
            Choose from Graphics Library
          </div>
        </div>
      )}

      {loadChangeThreekit && (
        <ViewLoadImg
          name={''}
          typeLoad={'Default graphic'}
          removeFile={() => RemoteDefaultLogogThreekit()}
          content={
            <>
              <LoaderWrap />
            </>
          }
        />
      )}
      {!loadChangeThreekit && IconInfo && (
        <ViewLoadImg
          name={IconInfo.label}
          typeLoad={'Default graphic'}
          removeFile={() => RemoteDefaultLogogThreekit()}
          content={
            <>
              <img src={IconInfo.img} alt="" />
            </>
          }
        />
      )}

      <OverlayingPopup
        isOpened={openDefaultGrafic}
        onClose={() => setOpenDefaultGrafic(false)}
      >
        <ModalsWrap
          onCancel={() => setOpenDefaultGrafic(false)}
          onConfirm={() => {
            if (selectedDefaultGrafic) {
              setDefaultLogogThreekit(selectedDefaultGrafic);
              setConfirmDefaultGrafic(selectedDefaultGrafic);
            }

            setOpenDefaultGrafic(false);
          }}
          name={'Default graphics library'}
          isShowConfirm={selectedDefaultGrafic !== undefined}
        >
          <DefaultGraphics onChange={setSelectedDefaultGrafic} />
        </ModalsWrap>
      </OverlayingPopup>
    </>
  );
};
