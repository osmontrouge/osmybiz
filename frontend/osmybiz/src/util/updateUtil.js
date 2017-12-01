import * as _ from 'lodash'
import {latLng} from 'leaflet'

export function getUpdate (ourNode, osmNode) {
  if (!_.isObject(osmNode)) {
    return {
      kind: 'delete',
      coords: latLng(ourNode.lat, ourNode.lng),
      id: ourNode.osmId
    }
  } else if (osmNode.version > ourNode.version) {
    return {
      kind: 'update',
      coords: latLng(ourNode.lat, ourNode.lng),
      id: ourNode.osmId,
      changeSet: osmNode.changeSet,
      oldVersion: parseInt(ourNode.version),
      newVersion: parseInt(osmNode.version)
    }
  }
  // no change
  return null
}
