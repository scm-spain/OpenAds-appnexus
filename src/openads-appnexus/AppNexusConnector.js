import {
  AD_AVAILABLE,
  AD_BAD_REQUEST,
  AD_ERROR,
  AD_NO_BID,
  AD_REQUEST_FAILURE
} from './event/events'

/**
 * @class
 * @implements {AdLoadable}
 * @implements {AdViewable}
 * @implements {Logger}
 */
export default class AppNexusConnector {
  constructor({pageOpts, logger, astClient, adRepository, loggerProvider}) {
    this._logger = logger
    this._adRepository = adRepository
    this._loggerProvider = loggerProvider
    this._astClient = astClient
    this._pageOpts = pageOpts
    if (this._pageOpts) {
      this._astClient.setPageOpts(this._pageOpts)
    }
  }

  display({id}) {
    return Promise.resolve()
      .then(() => this._astClient.showTag({targetId: id}))
      .then(null)
  }

  loadAd({id, specification = {}} = {}) {
    return Promise.resolve()
      .then(() => this._adRepository.remove({id}))
      .then(() => this._astClient.defineTag(specification.appnexus))
      .then(astClient =>
        astClient.onEvent({
          event: AD_AVAILABLE,
          targetId: id,
          callback: consumer(this._adRepository)(id)(AD_AVAILABLE)
        })
      )
      .then(astClient =>
        astClient.onEvent({
          event: AD_BAD_REQUEST,
          targetId: id,
          callback: consumer(this._adRepository)(id)(AD_BAD_REQUEST)
        })
      )
      .then(astClient =>
        astClient.onEvent({
          event: AD_ERROR,
          targetId: id,
          callback: consumer(this._adRepository)(id)(AD_ERROR)
        })
      )
      .then(astClient =>
        astClient.onEvent({
          event: AD_NO_BID,
          targetId: id,
          callback: consumer(this._adRepository)(id)(AD_NO_BID)
        })
      )
      .then(astClient =>
        astClient.onEvent({
          event: AD_REQUEST_FAILURE,
          targetId: id,
          callback: consumer(this._adRepository)(id)(AD_REQUEST_FAILURE)
        })
      )
      .then(astClient => astClient.loadTags())
      .then(() => this._adRepository.find({id}))
  }

  refresh({id, specification}) {
    return Promise.resolve()
      .then(() => this._adRepository.remove({id}))
      .then(() => {
        if (specification) {
          this._astClient.modifyTag({
            targetId: id,
            data: specification
          })
        }
      })
      .then(() => this._astClient.refresh([id]))
      .then(() => this._adRepository.find({id}))
  }

  enableDebug({debug}) {
    this._astClient.debugMode({debug})
    this._loggerProvider.debugMode({debug})
  }
}
const consumer = adRepository => id => status => data =>
  adRepository.save({id, adResponse: {data, status}})
