import React from 'react';
import s from './ConfiguraionScreen.module.scss';
import { View } from '../../wigetch/View/View';
import { Configuration } from '../../wigetch/Configuration/Configuration';
import { LoaderPage } from '../LoaderPage/LoaderPage';
import { ThreekitProvider } from '@threekit-tools/treble/dist';
import { useParams } from 'react-router';
export const ConfiguraionScreen = () => {
  const { configID } = useParams();
  if (!configID) return <></>;
  const saveConfig: Record<string, string> = {
    short: '5rabMva22',
    jersey: 'y02VQRz0y',
    w_hoodie: '5rabMva22',
    w_pant: '5rabMva22',
  };

  const projects = {
    credentials: {
      preview: {
        publicToken: 'a5cde04b-734f-4983-bb1d-33b575a42020',
        orgId: '62e2af29-9c24-48f3-ad7b-ddac67694a2a',
      },
    },
    products: {
      preview: {
        configurationId: saveConfig[configID],
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

        <div className={s.page}>
          <View />

          <div className={s.wrap_configurator}>
            <Configuration />
          </div>
        </div>
      </ThreekitProvider>
    </>
  );
};
