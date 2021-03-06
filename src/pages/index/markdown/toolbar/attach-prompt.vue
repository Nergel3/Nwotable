<template>
  <div>
    <q-dialog :value="active" @hide="close">
      <card>
        <h5 class="q-my-sm">Add an attachment.</h5>
        <span>List of all imported attachments :</span>
        <q-list class="q-mt-md">
          <div v-if="attachmentList.length">
            <q-item
              v-for="attachment in attachmentList"
              :key="attachment.name"
              clickable
              class="bg-white text-secondary attach-item q-pl-md q-pr-sm"
            >
              <q-item-label @click="copy(attachment.name)">
                <label class="text-grey-5">@attachment/</label>
                <label :title="attachment.name">{{ attachment.name }}</label>
              </q-item-label>
              <q-item-section>
                <div class="float-right">
                  <label class="text-grey-5" v-if="inUse(attachment.name)">used here</label>
                  <q-btn
                    icon="clear"
                    @click="delAttachPopUp = true"
                    size="xs"
                    round
                    flat
                    class="text-grey-5 q-ml-sm"
                  />
                </div>
              </q-item-section>
              <!-- Delete attach prompt -->
              <q-dialog v-model="delAttachPopUp">
                <card>
                <h5 class="q-mb-md q-mt-none">Warning !</h5>
                <span> You are about to delete this attachment, are you sure ?</span>
                <br />
                <div class="float-right">
                  <button class="btn" title="Cancel" @click="delAttachPopUp = false">
                    Cancel
                  </button>
                  <button class="btn" id="delete-btn" title="Okay" @click="delAttach(attachment)">
                    I'm sure.
                  </button>
                </div>
                </card>
              </q-dialog>
            </q-item>
          </div>
          <q-item class="bg-white text-secondary q-pl-md q-pr-sm" v-else>
            <q-item-label>No attachment imported in this app.</q-item-label>
          </q-item>
        </q-list>
        <div class="float-right">
          <button class="btn" title="Cancel" @click="close">
            Cancel
          </button>
          <button class="btn"
            title="Import picture"
            @click="importAttach"
          >
            Add a picture.
          </button>
        </div>
      </card>
    </q-dialog>
    <!-- Copied popup -->
    <q-dialog v-model="copiedPopUp" position="top">
      <card>
        copied to clipboard !
      </card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import card from 'src/components/card.vue';

export default {
  components: {
    card
  },
  props: {
    active: Boolean
  },
  data: () => ({
    copiedPopUp: false,
    delAttachPopUp: false
  }),
  methods: {
    close() {
      this.$emit('close');
    },
    inUse(attachName) {
      const regex = new RegExp(`!\\[\.*\\]\\(@attachment\\/${attachName}\\)`);
      return regex.test(this.selectedNote.plainNote);
    },
    importAttach() {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;

      document.getElementsByTagName('body')[0].appendChild(input);
      input.click();

      input.addEventListener('change', async() => {
        // eslint-disable-next-line
        const files = input.files;
        if (files) {
          for (let i = 0, length = files.length; i < length; i++) {
            const file = files[i];
            this.$store.dispatch('addAttachment', file);
          }
        }
      });
      input.remove();
    },
    async delAttach(attachment) {
      await this.$store.dispatch('delAttachment', attachment);
      this.delAttachPopUp = false;
      if (this.attachmentList.length === 0) {
        this.close();
      }
    },
    copy(attachName) {
      // NOTE add popup 'copied'
      const el = document.createElement('textarea');
      el.value = `![${attachName}](@attachment/${attachName})`;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.copiedPopUp = true;
      setTimeout(() => {
        this.copiedPopUp = false;
        this.close();
      }, 500);
    }
  },
  computed: mapState({
    selectedNote: state => state.Editor.selectedNote,
    attachmentList: state => state.Attachments.attachmentList
  })
};
</script>

<style lang="stylus" scoped>

.card {
  min-width 40vw

  & .q-item {
    width 100%
    overflow hidden
    text-overflow: ellipsis;
    white-space: nowrap;

    & *:hover {
      cursor pointer
    }

    & .q-item__section {
      flex-direction row
    }

    & span {
      max-width 93%
      overflow hidden
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  & .q-item:first-child {
    border-top-right-radius: 1em;
    border-top-left-radius: 1em;
  }

  & .q-item:last-child {
    border-bottom-right-radius: 1em;
    border-bottom-left-radius: 1em;
    margin-bottom: 1em;
  }

  & > div.float-right {
    margin-top 1em

    & button:last-child {
      margin-left 1em
      color $grey-1
      background-color $primary
      transition .1s filter

      &:hover {
        filter brightness(1.1)
      }

      &:active {
        filter brightness(.9)
      }
    }
  }
}
</style>
