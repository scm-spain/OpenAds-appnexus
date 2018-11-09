import {TIMEOUT_DEBOUNCE, TIMEOUT_BUFFER} from './timeout/timeout'

/**
 * @class
 * @implements {AstClient}
 */
export default class AstClientImpl {
  constructor({logger, apnTag}) {
    this._apnTag = apnTag
    this._logger = logger
    this._debounceTimeOutDelay = TIMEOUT_DEBOUNCE
    this._debounceTimerID = null
    this._bufferTimeOutDelay = TIMEOUT_BUFFER
    this._bufferTimerID = null
    this._bufferAccumulator = []
  }

  debugMode({enabled}) {
    this._apnTag.debug = enabled
    return this
  }

  setPageOpts(data) {
    this._logger.debug(this._logger.name, '| setPageOpts | pageOpts:', data)
    this._apnTag.anq.push(() => this._apnTag.setPageOpts(data))
    return this
  }

  onEvent({event, targetId, callback}) {
    this._logger.debug(
      this._logger.name,
      '| onEvent | event:',
      event,
      '| targetId:',
      targetId
    )
    this._apnTag.anq.push(() => this._apnTag.onEvent(event, targetId, callback))
    return this
  }

  defineTag(data) {
    this._logger.debug(this._logger.name, '| defineTag | data:', data)
    this._apnTag.anq.push(() => this._apnTag.defineTag(data))
    return this
  }

  loadTags() {
    this._logger.debug(this._logger.name, '| loadTags has been requested')
    if (this._debounceTimerID !== null) clearTimeout(this._debounceTimerID)
    this._loadTagsDebounceOperator()
    return this
  }

  _loadTagsDebounceOperator() {
    this._debounceTimerID = setTimeout(() => {
      this._logger.debug(this._logger.name, '| loadTags has been called')
      this._apnTag.anq.push(() => this._apnTag.loadTags())
      this._debounceTimerID = null
    }, this._debounceTimeOutDelay)
  }

  showTag({targetId}) {
    this._logger.debug(this._logger.name, '| showTag | targetId:', targetId)
    this._apnTag.anq.push(() => this._apnTag.showTag(targetId))
    return this
  }

  refresh(targetsArray) {
    this._logger.debug(
      this._logger.name,
      '| refresh | targetsArray:',
      targetsArray
    )
    if (this._bufferTimerID !== null) clearTimeout(this._bufferTimerID)
    this._bufferAccumulator = this._bufferAccumulator.concat(targetsArray)
    this._refreshBufferOperator()
    return this
  }

  _refreshBufferOperator() {
    this._bufferTimerID = setTimeout(() => {
      this._logger.debug(this._logger.name, '| refresh has been called')
      this._apnTag.anq.push(() => this._apnTag.refresh(this._bufferAccumulator))
      this._bufferTimerID = null
      this._bufferAccumulator = []
    }, this._bufferTimeOutDelay)
  }

  modifyTag({targetId, data}) {
    this._logger.debug(
      this._logger.name,
      '| modifyTag | targetId:',
      targetId,
      '| data:',
      data
    )
    this._apnTag.anq.push(() => this._apnTag.modifyTag(targetId, data))
    return this
  }
}
