<template>
  <div class="popup-data">
    <div class="popup-title">{{title}}</div>
    <div class="popup-entry">{{adress}}</div>

    <div v-if="isNew">
      <button  @click="create()" :disabled="!parent.isLoggedIn" :title="helpText" class="popup-btn">{{buttonText}}</button>
    </div>

    <div v-if="!isNew">
      <button v-if="canEdit" @click="edit()" :disabled="!parent.isLoggedIn" :title="helpText" class="popup-btn">{{buttonText}}</button>

      <div v-if="!canEdit && link">
        <div>{{warning}}</div>
        <button @click="toComment()" :disabled="!parent.isLoggedIn" :title="helpText" class="popup-btn">{{comment}}</button>
      </div>

    </div>


    <div @click="toOsm()" class="popup-link">{{maplink}}</div>
    <div @click="toOsmError()" class="popup-link">{{feedback}}</div>
  </div>
</template>

<script>
  import { get } from './../util/translate';
  import { osmUrl } from './../config/config';
  import { reverseQuery } from './../api/nominatimApi';
  import { getNotes } from './../api/osmApi';

  function checkDuplicateNote(data) {
    return getNotes(data.lat, data.lng).then((ps) => {
      let existingNoteLink = '';
      ps.forEach((note) => {
        if (note.properties.status === 'open') {
          const text = note.properties.comments[0].text;
          const fields = text.split('\n');
          if (fields.length >= 2) {
            const cat = fields[3].split(':')[1].substring(1);
            if (fields[0] === '#OSMyBiz ' &&
              fields[3] === `Category: ${cat}:${data.tags[cat]}` &&
              fields[4] === `Name: ${data.tags.name}`) {
              existingNoteLink = `https://master.apis.dev.openstreetmap.org/note/${note.properties.id}/#map=19/${note.geometry.coordinates[1]}/${note.geometry.coordinates[0]}&layers=ND`;
            }
          }
        }
      });
      return existingNoteLink;
    });
  }

  function printAddress(address) {
    let out = '';
    let hasData = false;
    if (address.street) {
      hasData = true;
      out += address.street;
      if (address.housenumber) {
        out += ` ${address.housenumber}`;
      }
    }
    if (address.city) {
      out += (hasData ? ', ' : '') + address.city;
    }
    return out;
  }

  function loadAddress(lat, lng) {
    return reverseQuery(lat, lng).then(adr => printAddress(adr));
  }

  export default {
    mounted() {
      loadAddress(this.coords.lat, this.coords.lng).then((adress) => {
        this.adress = adress;
      });

      if (!this.isNew) {
        checkDuplicateNote(this.business).then((link) => {
          if (link) {
            this.link = link;
            this.canEdit = false;
          } else {
            this.canEdit = true;
          }
        });
      }
    },
    methods: {
      create() {
        this.parent.createNew(this.coords);
      },
      edit() {
        this.parent.edit(this.business);
      },
      toComment() {
        window.open(this.link, '_blank');
      },
      toOsm() {
        const url = `${osmUrl}/#map=19/${this.coords.lat}/${this.coords.lng}&layers=N`;
        window.open(url, '_blank');
      },
      toOsmError() {
        const url = `${osmUrl}/note/new?lat=${this.coords.lat}&lon=${this.coords.lng}#map=19/${this.coords.lat}/${this.coords.lng}&layers=N`;
        window.open(url, '_blank');
      },
    },
    data() {
      return {
        adress: '',
        link: '',
        canEdit: false,
      };
    },
    computed: {
      maplink() {
        return get().locale.popups.mapLink;
      },
      feedback() {
        return get().locale.popups.feedback;
      },
      title() {
        if (this.isNew) {
          return get().locale.popups.popuptitle;
        }
        return this.business.tags.name || '';
      },
      buttonText() {
        if (this.isNew) {
          return get().locale.popups.create;
        }
        return get().locale.popups.edit;
      },
      warning() {
        return get().locale.popups.warning;
      },
      comment() {
        return get().locale.popups.comment;
      },
      helpText() {
        if (this.parent.isLoggedIn) {
          return '';
        }
        return get().locale.popups.buttontitle;
      },
    },
    props: ['text', 'parent', 'isNew', 'coords', 'business'],
    name: 'map-popup',
  };
</script>
<style>
  .popup-data {
    display: flex;
    flex-direction:column;
    font-size: 16px;
    min-width: 200px;
    align-items: flex-start;
  }

  .popup-title {
    font-weight: bold;
  }

  .popup-link {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
