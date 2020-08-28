let styleJson1 = [
  {
    featureType: 'land',
    elementType: 'all',
    stylers: {
      color: '#d5eff2ff'
    }
  },
  {
    featureType: 'local',
    elementType: 'all',
    stylers: {
      color: '#9fbbbeff',
      visibility: 'off'
    }
  },
  {
    featureType: 'building',
    elementType: 'geometry.fill',
    stylers: {
      color: '#cbe3e5ff'
    }
  },
  {
    featureType: 'manmade',
    elementType: 'all',
    stylers: {
      color: '#d7e9eaff'
    }
  },
  {
    featureType: 'green',
    elementType: 'all',
    stylers: {
      color: '#d7e9eaff'
    }
  },
  {
    featureType: 'arterial',
    elementType: 'geometry.fill',
    stylers: {
      color: '#e0fcffff',
      weight: '0.5'
    }
  },
  {
    featureType: 'highway',
    elementType: 'geometry',
    stylers: {
      color: '#90d6deff',
      weight: '0.5'
    }
  },
  {
    featureType: 'subway',
    elementType: 'geometry',
    stylers: {
      color: '#8bcbd38c',
      weight: '0.5'
    }
  },
  {
    featureType: 'local',
    elementType: 'all',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'subway',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#343434ff'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#485e5eff'
    }
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#2b3334ff'
    }
  },
  {
    featureType: 'highway',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'city',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'highway',
    elementType: 'all',
    stylers: {
      weight: '0.5'
    }
  },
  {
    featureType: 'highway',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#263c3eff'
    }
  },
  {
    featureType: 'highway',
    elementType: 'labels.text.stroke',
    stylers: {
      color: '#ffffffff'
    }
  },
  {
    featureType: 'subway',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'railway',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#6eaab2ff'
    }
  },
  {
    featureType: 'boundary',
    elementType: 'all',
    stylers: {
      color: '#7ebcc3ff'
    }
  },
  {
    featureType: 'arterial',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#4d6062ff'
    }
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: {
      color: '#b4e5eaff'
    }
  },
  {
    featureType: 'railway',
    elementType: 'all',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'local',
    elementType: 'labels',
    stylers: {
      visibility: 'off'
    }
  }
]
//黑色风格
let styleJson = [
  {
    featureType: 'background',
    elementType: 'geometry',
    stylers: {
      color: '#1f2740ff'
    }
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: {
      color: '#333a4fff'
    }
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: {
      color: '#565c6fff'
    }
  },
  {
    featureType: 'green',
    elementType: 'all',
    stylers: {
      color: '#2f374eff'
    }
  },
  {
    featureType: 'manmade',
    elementType: 'labels',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'local',
    elementType: 'geometry',
    stylers: {
      color: '#0a132eff'
    }
  },
  {
    featureType: 'arterial',
    elementType: 'all',
    stylers: {
      color: '#0a132eff'
    }
  },
  {
    featureType: 'local',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#828795ff'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#a7adbfff'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.text.stroke',
    stylers: {
      color: '#151d38ff'
    }
  },
  {
    featureType: 'subway',
    elementType: 'geometry',
    stylers: {
      color: '#8f93a1ff'
    }
  },
  {
    featureType: 'subway',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#cbced8ff'
    }
  },
  {
    featureType: 'subway',
    elementType: 'labels.text.stroke',
    stylers: {
      color: '#151d38ff'
    }
  },
  {
    featureType: 'subwaystation',
    elementType: 'geometry',
    stylers: {
      color: '#a1a7baff'
    }
  },
  {
    featureType: 'districtlabel',
    elementType: 'all',
    stylers: {
      color: '#cdd0dbff'
    }
  },
  {
    featureType: 'districtlabel',
    elementType: 'labels.text.stroke',
    stylers: {
      color: '#151d38ff'
    }
  },
  {
    featureType: 'districtlabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'railway',
    elementType: 'geometry.fill',
    stylers: {
      color: '#edeef4ff'
    }
  }
]

let styleJson2 = [
  //淡蓝色风格
  {
    featureType: 'background',
    elementType: 'all',
    stylers: {
      color: '#cce8f5ff'
    }
  },
  {
    featureType: 'green',
    elementType: 'all',
    stylers: {
      color: '#b7d0dcff'
    }
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: {
      color: '#b7d0dcff'
    }
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: {
      color: '#95a9b3ff'
    }
  },
  {
    featureType: 'arterial',
    elementType: 'geometry.fill',
    stylers: {
      color: '#d4f1ffff'
    }
  },
  {
    featureType: 'arterial',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#bed7e4ff'
    }
  },
  {
    featureType: 'local',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#bed7e4ff'
    }
  },
  {
    featureType: 'local',
    elementType: 'geometry.fill',
    stylers: {
      color: '#d4f1ffff'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#4f6068ff'
    }
  },
  {
    featureType: 'poilabel',
    elementType: 'labels.text.stroke',
    stylers: {
      color: '#d4f1ffff'
    }
  },
  {
    featureType: 'subway',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#364248ff'
    }
  },
  {
    featureType: 'subway',
    elementType: 'labels.text.stroke',
    stylers: {
      color: '#e8f8ffff'
    }
  },
  {
    featureType: 'railway',
    elementType: 'geometry.fill',
    stylers: {
      color: '#edf3f6ff'
    }
  },
  {
    featureType: 'railway',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#3c5865ff'
    }
  },
  {
    featureType: 'highway',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#1a2d36ff'
    }
  },
  {
    featureType: 'highway',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#eaeef1ff'
    }
  },
  {
    featureType: 'districtlabel',
    elementType: 'labels.text.fill',
    stylers: {
      color: '#253a4aff'
    }
  },
  {
    featureType: 'districtlabel',
    elementType: 'labels.icon',
    stylers: {
      visibility: 'off'
    }
  },
  {
    featureType: 'subway',
    elementType: 'all',
    stylers: {}
  }
]

export { styleJson1, styleJson, styleJson2 }
