import React, { useEffect, useState } from 'react';
import { LineParam } from '../../LineParam/LineParam';
import { AITextIcon } from '../../../assets/svg/AITextIcon';
import { GraphicIcon } from '../../../assets/svg/GraphicIcon';
import { useNavigate, useParams } from 'react-router';
import { filterAvailableZones } from '../../../data/areasObjects';
import { getProductByKey } from '../../../data/productInformation';
import { useDispatch } from 'react-redux';
import { setCurentLayer } from '../../../function/providers/redax/action';
import { useSelector } from 'react-redux';
import { getCurentLayer } from '../../../function/providers/redax/selectore';
import { useConfigurator } from '@threekit-tools/treble/dist';
import {
  resetObjectGraphic,
  resetObjectText,
} from '../../../function/ThreekitAttributeText';
export const PersonalizationTypeAria = () => {
  const [TypePersonalize, setTypePersonalize] = useState('text');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { configID } = useParams();
  if (!configID) return <></>;

  const curentLayer = useSelector(getCurentLayer);
  const product = getProductByKey(configID);
  if (!product) return <></>;

  const [attributes, setConfiguration]: any = useConfigurator();

  if (!attributes) return <></>;
  if (Object.keys(attributes).length < 1) return <></>;

  const listPersonalization = [
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              marginRight: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AITextIcon />
          </span>
          Text
        </div>
      ),
      value: 'text',
    },
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <GraphicIcon /> Graphics
        </div>
      ),
      value: 'graphic',
    },
  ];

  const setTypeArea = (typeArea: string) => {
    if (curentLayer['typeArea'] === 'text') {
      if (curentLayer && curentLayer['nameThreekit'])
        resetObjectText(setConfiguration, curentLayer['nameThreekit']);
    }
    if (curentLayer['typeArea'] === 'graphic') {
      if (curentLayer && curentLayer['nameThreekit'])
        resetObjectGraphic(setConfiguration, curentLayer['nameThreekit']);
    }
    setTypePersonalize(typeArea);
    navigate(typeArea);
    dispatch(
      setCurentLayer({
        typeArea: typeArea,
      })
    );
  };

  const availableZones = filterAvailableZones(configID, listPersonalization);

  useEffect(() => {
    setTypeArea(availableZones[0]['value']);
  }, []);

  return (
    <LineParam
      name="Personalization type"
      values={availableZones}
      isSelectedId={TypePersonalize}
      onClickBtn={(value) => {
        setTypeArea(value['value']);
      }}
    />
  );
};
