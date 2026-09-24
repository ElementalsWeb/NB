import React, { useEffect } from 'react';
import s from './ConfiguraionScreen.module.scss';
import { View } from '../../wigetch/View/View';
import { Configuration } from '../../wigetch/Configuration/Configuration';
import { LoaderPage } from '../LoaderPage/LoaderPage';
import { ThreekitProvider } from '@threekit-tools/treble/dist';
import { useParams } from 'react-router';
import { ChangeProduc } from '../../features/Threekit/UI/ChangeProduc/ChangeProduc';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restoreConfig } from '../../shared/function/providers/redax/action';
import { ResoreConfig } from '../../wigetch/ResoreConfig/ResoreConfig';

export const ConfiguraionScreen = () => {
  const { configID } = useParams();
  const [searchParams] = useSearchParams();
  const tkid = searchParams.get('tkid');

  const saveConfig: Record<string, string> = {
    // Scene
    // Shorts: 'rL7-gjOig',
    // Jersey: 'n0nAvYnGH',
    // Hoodie: 'JOksyDpjv',
    // Pants: 'tjic2RroK',

    // Item
    Shorts: 'PX6cvl4pP',
    Jersey: 'L_nS0OEWW',
    Hoodie: 'oHfib52L2',
    Pants: 'GEnZUGUiM',
  };

  if (!configID) return <></>;

  let shortId = saveConfig[configID];

  if (tkid) shortId = tkid;

  const projects = {
    credentials: {
      preview: {
        publicToken: '2e113be6-bbfb-48c6-998a-7efa10593f29',
        orgId: '62e2af29-9c24-48f3-ad7b-ddac67694a2a',
      },
    },
    products: {
      preview: {
        // configurationId: saveConfig[configID],
        configurationId: shortId,
      },
    },
  };

  const threekitEnv: string = 'preview';
  const playerConfig: any = {
    allowMobileVerticalOrbit: true,
    // onAnnotationChange: (annotations: any, parentEl: any) => {
    //   // onAnnotationChange(navigate)(annotations, parentEl);
    // },
  };

  return (
    <>
      <ThreekitProvider
        project={projects}
        threekitEnv={threekitEnv}
        playerConfig={playerConfig}
      >
        <LoaderPage />
        <ChangeProduc />
        <ResoreConfig />
        <div className={s.page}>
          <div className={s.view}>
            <View />
          </div>
          <div className={s.wrap_configurator}>
            <Configuration />
          </div>
        </div>
      </ThreekitProvider>
    </>
  );
};
