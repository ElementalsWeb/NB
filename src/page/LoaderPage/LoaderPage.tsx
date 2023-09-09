import React, { useEffect } from 'react';
import s from './LoaderPage.module.scss';
import { useThreekitInitStatus } from '@threekit-tools/treble/dist';
import {
  StartTutorial,
  tutorialItemT,
} from '../../shared/UI/StartTutorial/StartTutorial';
import tutorial_1 from '../../shared/assets//images/tutorial/tutorial_1.png';
import tutorial_2 from '../../shared/assets//images/tutorial/tutorial_2.png';
import tutorial_3 from '../../shared/assets//images/tutorial/tutorial_3.png';
import { getLoadersName } from '../../shared/function/providers/redax/selectore';
import { useSelector } from 'react-redux';

const tutorialItem: tutorialItemT[] = [
  {
    id: 0,
    src: tutorial_1,
    title: 'Flexible text customization',
    subtitle:
      'Customizing your own text on a T-shirt or other clothing is now much easier thanks to flexible settings. Change the font, size, position, color, and effects such as warping and more',
  },
  {
    id: 1,
    src: tutorial_2,
    title: 'Standard and custom graphics',
    subtitle:
      'Easily upload your own graphics, logos, or choose from standard objects and customize them',
  },
  {
    id: 2,
    src: tutorial_3,
    title: 'Сonvenient review ',
    subtitle: 'Simple and clear review of your objects that have been applied',
  },
];
export const LoaderPage = () => {
  const hasLoadedStatus = useThreekitInitStatus();
  const isChangetProduct = useSelector(getLoadersName('loadChangetProduct'));

  // const hasLoadedPage = false;
  const hasLoadedPage = hasLoadedStatus || isChangetProduct;
  const isShowLoaded = isChangetProduct || !hasLoadedPage;

  // useEffect(() => {
  //   const movingRect: any = document.getElementById('movingRect');
  //   let yPos = 0;

  //   const animateMask = () => {
  //     yPos += 1;
  //     movingRect.setAttribute('y', `${yPos}%`);
  //     requestAnimationFrame(animateMask);
  //   };

  //   animateMask();
  // }, []);
  console.log('hasLoadedPage', hasLoadedPage);

  return (
    <>
      {isShowLoaded && (
        <div className={s.wrapPage}>
          <StartTutorial data={tutorialItem} />
          <div className={s.main}>
            <div className={s.logo}>
              <div className={s.svgContainer}>
                <svg
                  width="178"
                  height="86"
                  viewBox="0 0 178 86"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="my-clip">
                      <title>My Clip Path</title>
                      <desc>
                        an svg rectangle using a circle as the clipping target
                        and animated with SMIL
                      </desc>
                      <rect x="0" y="0" width="178" height="86">
                        {/* <animate
                attributeType="XML"
                attributeName="x"
                from="-100"
                to="100"
                dur="2s"
                repeatCount="indefinite"
              /> */}
                      </rect>
                    </clipPath>
                  </defs>

                  {/* <circle
          clip-path="url(#my-clip)"
          width="178"
          height="86"
          cx="50"
          r="50"
          cy="50"
          fill="green"
        /> */}
                  <path
                    clipPath="url(#my-clip)"
                    d="M107.629 0H155.641C170.407 0 181.32 5.30978 177.075 20.8681C175.833 25.5204 170.06 37.0359 153.224 42.2191C152.876 42.1497 152.524 42.0937 152.17 42.0514L152.111 42.5478L152.247 43.0289C152.585 42.9333 152.919 42.8351 153.249 42.7345C154.615 43.0204 155.93 43.5218 157.145 44.222C158.694 45.1149 160.047 46.3127 161.124 47.7438C162.202 49.1749 162.98 50.8098 163.414 52.5505C163.847 54.2913 163.926 56.102 163.647 57.8743C160.809 76.9107 136.261 85.9768 122.602 85.9768H66.0539M107.629 0L101.794 10.0914L102.349 10.1302M107.629 0V0.5H107.917M107.629 0L108.062 0.250293L107.917 0.5M102.349 10.1302L102.07 10.612L126.852 12.3434L126.963 12.1408L127.401 12.3818L127.366 12.8806L127.136 12.8644L126.432 14.144L98.5156 15.9525M102.349 10.1302L127.436 11.883L128.216 11.9375L127.839 12.6227L126.87 14.3849L126.738 14.6252L126.465 14.6429L98.8157 16.4342M102.349 10.1302L107.917 0.5M98.5156 15.9525L90.5104 29.8916L91.0665 29.9273M98.5156 15.9525L98.548 16.4515L98.8157 16.4342M98.5156 15.9525L98.9492 16.2015L98.8157 16.4342M91.0665 29.9273L90.789 30.4105L115.654 32.0083L115.78 31.7921L116.212 32.0442L116.18 32.5432L115.93 32.5271L115.196 33.7832L26.6014 39.5567M91.0665 29.9273L116.244 31.5452L117.051 31.5971L116.643 32.2963L115.628 34.0353L115.494 34.2649L115.229 34.2822L26.904 40.0381M91.0665 29.9273L98.8157 16.4342M26.6014 39.5567L22.952 46.0289L23.5065 46.0635M26.6014 39.5567L26.6339 40.0557L26.904 40.0381M26.6014 39.5567L27.0369 39.8023L26.904 40.0381M23.5065 46.0635L23.2336 46.5475L104.42 51.6255L104.541 51.4125L104.976 51.6603L104.944 52.1593L104.7 52.144L103.984 53.3993L58.6729 56.059L58.8045 56.5522M23.5065 46.0635L105.007 51.1612L105.807 51.2113L105.41 51.908L104.418 53.647L104.284 53.8825L104.013 53.8984L58.8045 56.5522M23.5065 46.0635L26.904 40.0381M58.8045 56.5522L58.295 56.5821L61.6472 69.1431M58.8045 56.5522L62.0373 68.666M61.6472 69.1431L93.3884 71.0799L93.5156 70.8619L93.9475 71.114L93.917 71.6131L93.6651 71.5977L92.9323 72.853L63.7689 74.927L63.8937 75.4194M61.6472 69.1431L62.1303 69.0142L62.0373 68.666M61.6472 69.1431L61.6776 68.6441L62.0373 68.666M63.8937 75.4194L63.387 75.4554L66.0539 85.9768M63.8937 75.4194L66.4429 85.4768M63.8937 75.4194L92.9678 73.3518L93.231 73.333L93.3641 73.1051L94.3793 71.3661L94.7889 70.6644L93.9779 70.6149L62.0373 68.666M66.0539 85.9768L66.5385 85.8539L66.4429 85.4768M66.0539 85.9768V85.4768H66.4429M66.4429 85.4768H122.602C129.342 85.4768 138.809 83.2343 146.936 78.6292C155.064 74.0236 161.765 67.1074 163.152 57.8006L163.153 57.7964C163.422 56.0903 163.346 54.3471 162.928 52.6714C162.511 50.9956 161.762 49.4219 160.725 48.0445C159.688 46.6671 158.386 45.5143 156.895 44.6552C155.405 43.7961 153.758 43.2482 152.052 43.0443L151.975 42.0667C169.477 37.1131 175.361 25.3476 176.591 20.7392L176.592 20.7365C177.638 16.9039 177.739 13.744 177.107 11.1626C176.478 8.58884 175.114 6.55942 173.172 4.98835C169.265 1.82648 162.991 0.5 155.641 0.5H107.917M15.2731 59.3351L57.2602 56.1349L56.9586 56.6593M15.2731 59.3351L11.6058 65.7365L12.164 65.768M15.2731 59.3351L15.3111 59.8337L15.5753 59.8135M15.2731 59.3351L15.707 59.5836L15.5753 59.8135M12.164 65.768L11.8861 66.2531L50.7573 68.4475M12.164 65.768L50.4776 67.9309M12.164 65.768L15.5753 59.8135M50.7573 68.4475L57.5618 56.6134L56.9586 56.6593M50.7573 68.4475L50.7855 67.9483L50.4776 67.9309M50.7573 68.4475L50.3239 68.1983L50.4776 67.9309M56.9586 56.6593L50.4776 67.9309M56.9586 56.6593L15.5753 59.8135M89.2732 29.8299L89.4067 30.3399L34.5622 26.7017L34.8388 26.219M89.2732 29.8299L89.7992 29.8648L86.3566 16.7178M89.2732 29.8299L85.9772 17.2427M89.2732 29.8299L34.8388 26.219M86.3566 16.7178L37.9523 19.7784M86.3566 16.7178L85.8729 16.8444L85.9772 17.2427M86.3566 16.7178L86.3882 17.2168L85.9772 17.2427M37.9523 19.7784L34.2836 26.1821L34.8388 26.219M37.9523 19.7784L37.9839 20.2774L38.2524 20.2604M37.9523 19.7784L38.3862 20.027L38.2524 20.2604M34.8388 26.219L38.2524 20.2604M38.2524 20.2604L85.9772 17.2427M125.686 65.3981C128.557 64.0373 131.222 61.8534 132.437 58.5851C133.607 55.5635 133.145 53.1874 131.929 51.5608C130.733 49.9618 128.847 49.143 127.263 49.143H117.896H117.606L117.462 49.3943L107.61 66.5757L107.181 67.3244H108.044H117.434C119.685 67.3244 122.815 66.759 125.686 65.3981ZM149.182 25.6966L149.182 25.6964C151.187 20.8403 148.521 16.3493 144.653 16.218L144.644 16.2177H144.636H136.722H136.433L136.289 16.4687L126.875 32.8618L126.445 33.6108H127.309L135.499 33.6108L135.502 33.6108C141.062 33.5871 146.977 31.0292 149.182 25.6966ZM45.4936 76.7105L40.4327 85.477L0.864423 85.4995L4.24603 79.6167L45.4936 76.7105ZM46.1894 6.4377L49.5711 0.500206L81.6343 0.522914L83.8269 8.80179L46.1894 6.4377Z"
                    stroke="#CF202E"
                  />
                </svg>
              </div>
            </div>
            <div className={s.title}>We're preparing your content</div>
            <div className={s.subTitle}>This shouldn't take too long</div>
          </div>
        </div>
      )}
    </>
  );
};
