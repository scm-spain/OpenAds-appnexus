import {expect} from 'chai'
import sinon from 'sinon'
import AstClientImpl from '../../openads-appnexus/AstClientImpl'

describe('AstClient implementation', function() {
  const createLoggerMock = () => ({
    error: () => null,
    debug: () => null
  })
  const createApnTagMock = () => ({
    anq: {
      push: func => func()
    },
    debug: false,
    setPageOpts: () => null,
    onEvent: () => null,
    defineTag: () => null,
    loadTags: () => null,
    showTag: () => null,
    refresh: () => null,
    modifyTag: () => null
  })
  describe('debugMode method', function() {
    it('should update the apntag debug value to the given value', function() {
      const apnTagMock = createApnTagMock()
      const astClient = new AstClientImpl({apnTag: apnTagMock})
      astClient.debugMode({enabled: true})
      expect(apnTagMock.debug, 'debug value should have been updated').to.be
        .true
    })
  })
  describe('setPageOpts method', () => {
    it('should call the apntag setPageOpts method via anq', function() {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const setPageOptsSpy = sinon.spy(apnTagMock, 'setPageOpts')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })
      const givenPageOpts = {
        member: 666
      }

      astClient.setPageOpts(givenPageOpts)

      expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
      expect(setPageOptsSpy.calledOnce, 'setPageOpts shoud have been called').to
        .be.true
      expect(
        setPageOptsSpy.args[0][0],
        'apntag setPageOpts should receive the page options'
      ).to.deep.equal(givenPageOpts)
    })
  })
  describe('defineTag method', function() {
    it('should call the apntag defineTag method via anq', function() {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const defineTagSpy = sinon.spy(apnTagMock, 'defineTag')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })
      const givenParameters = {
        member: '1',
        targetId: '2',
        keywords: {a: '3'},
        invCode: '5',
        sizes: [[6, 7]],
        native: {b: '8'}
      }
      astClient.defineTag(givenParameters)
      expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
      expect(defineTagSpy.calledOnce, 'defineTag shoud have been called').to.be
        .true
      expect(
        defineTagSpy.args[0][0],
        'apntag defineTag should receive the parameters in order'
      ).to.deep.equal(givenParameters)
    })
  })
  describe('loadTags method', function() {
    it('should call the apntag loadTags method via anq', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const loadTagsSpy = sinon.spy(apnTagMock, 'loadTags')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })
      astClient.loadTags()
      setTimeout(() => {
        expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
        expect(loadTagsSpy.calledOnce, 'loadTags shoud have been called').to.be
          .true
        done()
      }, 200)
    })
    it('should call the apntag loadTags method via anq once after several consecutive calls of loadTags AstClient', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const loadTagsSpy = sinon.spy(apnTagMock, 'loadTags')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })
      astClient
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
      setTimeout(() => {
        expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
        expect(loadTagsSpy.calledOnce, 'loadTags shoud have been called').to.be
          .true
        done()
      }, 200)
    })
    it('should call the apntag loadTags method via anq twice after several consecutive calls of loadTags AstClient', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const loadTagsSpy = sinon.spy(apnTagMock, 'loadTags')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })
      astClient
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
        .loadTags()
      setTimeout(() => {
        astClient.loadTags()
      }, 30)
      setTimeout(() => {
        expect(anqSpy.calledTwice, 'anq shoud have been called').to.be.true
        expect(loadTagsSpy.calledTwice, 'loadTags shoud have been called').to.be
          .true
        done()
      }, 200)
    })
  })
  describe('showTag method', function() {
    it('should call the apntag showTag method via anq', function() {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const showTagSpy = sinon.spy(apnTagMock, 'showTag')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })

      const givenParameters = {targetId: 'id'}
      astClient.showTag(givenParameters)
      const expectedUnnamedParameters = [givenParameters.targetId]
      expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
      expect(showTagSpy.calledOnce, 'showTag shoud have been called').to.be.true
      expect(
        showTagSpy.args[0],
        'apntag defineTag should receive the parameters in order'
      ).to.deep.equal(expectedUnnamedParameters)
    })
  })
  describe('refresh method', function() {
    it('should call the apntag refresh method via anq', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const refreshSpy = sinon.spy(apnTagMock, 'refresh')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })

      const givenParameters = ['target1', 'target2']
      astClient.refresh(givenParameters)
      setTimeout(() => {
        expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
        expect(refreshSpy.calledOnce, 'refresh shoud have been called').to.be
          .true
        expect(
          refreshSpy.args[0][0],
          'apntag refresh should receive the parameters in order'
        ).to.deep.equal(givenParameters)
        done()
      }, 200)
    })
    it('should call the apntag refresh method via anq once after several consecutive calls of refresh AstClient', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const refreshSpy = sinon.spy(apnTagMock, 'refresh')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })

      const givenParameters = [
        'target1',
        'target2',
        'target3',
        'target4',
        'target5',
        'target6',
        'target7',
        'target8'
      ]

      astClient
        .refresh(['target1'])
        .refresh(['target2', 'target3'])
        .refresh(['target4'])
        .refresh(['target5'])
        .refresh(['target6'])
        .refresh(['target7'])
        .refresh(['target8'])

      setTimeout(() => {
        expect(anqSpy.calledOnce, 'anq shoud have been called').to.be.true
        expect(refreshSpy.calledOnce, 'refresh shoud have been called').to.be
          .true
        expect(
          refreshSpy.args[0][0],
          'apntag refresh should receive the parameters in order'
        ).to.deep.equal(givenParameters)
        done()
      }, 200)
    })

    it('should call the apntag refresh method via anq twice after several consecutive calls of refresh AstClient', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const refreshSpy = sinon.spy(apnTagMock, 'refresh')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })

      const givenParametersFirstCall = [
        'target1',
        'target2',
        'target3',
        'target4',
        'target5',
        'target6',
        'target7',
        'target8'
      ]
      const givenParametersSecondCall = ['target9']

      astClient
        .refresh(['target1'])
        .refresh(['target2', 'target3'])
        .refresh(['target4'])
        .refresh(['target5'])
        .refresh(['target6'])
        .refresh(['target7'])
        .refresh(['target8'])

      setTimeout(() => {
        astClient.refresh(['target9'])
      }, 100)

      setTimeout(() => {
        expect(anqSpy.callCount, 'anq shoud have been called').to.equal(2)
        expect(refreshSpy.callCount, 'refresh shoud have been called').to.equal(
          2
        )
        expect(
          refreshSpy.args[0][0],
          'apntag refresh should receive the parameters in order'
        ).to.deep.equal(givenParametersFirstCall)
        expect(
          refreshSpy.args[1][0],
          'apntag refresh should receive the parameters in order'
        ).to.deep.equal(givenParametersSecondCall)
        done()
      }, 200)
    })

    it('should call the apntag refresh method via anq once after several consecutive calls of refresh AstClient', done => {
      const loggerMock = createLoggerMock()
      const apnTagMock = createApnTagMock()
      const refreshSpy = sinon.spy(apnTagMock, 'refresh')
      const anqSpy = sinon.spy(apnTagMock.anq, 'push')
      const astClient = new AstClientImpl({
        apnTag: apnTagMock,
        logger: loggerMock
      })

      const expectedCallArgs = [
        'target1',
        'target2',
        'target3',
        'target4',
        'target5',
        'target6',
        'target7',
        'target8',
        'target9'
      ]

      astClient
        .refresh(['target1'])
        .refresh(['target2', 'target3'])
        .refresh(['target4'])
        .refresh(['target5'])
        .refresh(['target6'])
        .refresh(['target7'])
        .refresh(['target8'])

      setTimeout(() => {
        astClient.refresh(['target9'])
      }, 10)

      setTimeout(() => {
        expect(anqSpy.callCount, 'anq shoud have been called').to.equal(1)
        expect(refreshSpy.callCount, 'refresh shoud have been called').to.equal(
          1
        )
        expect(
          refreshSpy.args[0][0],
          'apntag refresh should receive the parameters in order'
        ).to.deep.equal(expectedCallArgs)
        done()
      }, 100)
    })
  })
})
