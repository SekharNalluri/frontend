var dat = {
  'asset.transaction': {
    numCols: 12 / 3,
    url: '/asset-services-maha/assets/_search',
    tenantIdRequired: true,
    objectName: 'Revaluation',
    useTimestamp: true,
    groups: [
      {
        label: 'ac.transaction.RA.title',
        name: 'createCategoryType',
        fields: [
          {
            name: 'AssetSearchCode',
            jsonPath: 'revaluation.assetCategoryType',
            label: 'ac.create.asset.asset.category.type',
            pattern: '',
            type: 'singleValueList',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: [
              {
                key: null,
                value: '-- Please Select --',
              },
              {
                key: 'MOVABLE',
                value: 'MOVABLE',
              },
              {
                key: 'IMMOVABLE',
                value: 'IMMOVABLE',
              },
            ],
            depedants: [
              {
                jsonPath: 'revaluation.assetCategory',
                type: 'dropDown',
                pattern:"/egov-mdms-service/v1/_get?&moduleName=ASSET&masterName=AssetCategory&filter=%5B%3F%28+%40.isAssetAllow+%3D%3D+false+%26%26+%40.assetCategoryType+%3D%3D'{revaluation.assetCategoryType}'+%29%5D|$.MdmsRes.ASSET.AssetCategory.*.id|$.MdmsRes.ASSET.AssetCategory.*.name",
              },
            ],
          },
          {
            name: 'AssetCategory',
            jsonPath: 'revaluation.assetCategory',
            label: 'ac.create.Asset.Category',
            pattern: '',
            type: 'singleValueList',
            url:'',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            isStateLevel: true,
            depedants: [
              {
                jsonPath: 'revaluation.assetSubCategory',
                type: 'dropDown',
                pattern:
                  "/egov-mdms-service/v1/_get?&moduleName=ASSET&masterName=AssetCategory&filter=%5B%3F%28%40.parent%3D%3D'{revaluation.assetCategory}'%29%5D|$.MdmsRes.ASSET.AssetCategory.*.id|$.MdmsRes.ASSET.AssetCategory.*.name",
              },
            ],
          },
          {
            name: 'AssetSearchAssetSubCategory',
            jsonPath: 'revaluation.assetSubCategory',
            label: 'ac.create.Asset.SubCategory.Name',
            pattern: '',
            type: 'singleValueList',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'Department',
            jsonPath: 'department',
            label: 'ac.create.Department',
            pattern: '',
            type: 'singleValueList',
            url: '/egov-mdms-service/v1/_get?&masterName=Department&moduleName=common-masters|$..code|$..name',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            isStateLevel: true,
          },
          {
            name: 'AssetSearchCode',
            jsonPath: 'code',
            label: 'ac.search.asset.code',
            pattern: '',
            type: 'text',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'AssetSearchName',
            jsonPath: 'name',
            label: 'ac.search.asset.name',
            pattern: '',
            type: 'text',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'fromOriginalValue',
            jsonPath: 'originalValueFrom',
            label: 'ac.create.OriginalFromDate',
            pattern: '',
            type: 'number',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'toOriginalValue',
            jsonPath: 'originalValueTo',
            label: 'ac.create.OriginalToDate',
            pattern: '',
            type: 'number',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },

          {
            name: 'fromDate',
            jsonPath: 'assetCreatedFrom',
            label: 'ac.create.createFromDate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'toDate',
            jsonPath: 'assetCreatedTo',
            label: 'ac.create.createToDate',
            pattern: '',
            type: 'datePicker',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
          {
            name: 'transactionType',
            jsonPath: 'transaction',
            label: 'transaction',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            defaultValue: 'REVALUATION',
            isHidden: true,
          },
        ],
      },
    ],
    result: {
      header: [
        {
          name: '',
          jsonPath: 'isRadio',
          label: '',
          pattern: '',
          type: 'radio',
          isRequired: false,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          values: [{ label: '', value: true }],
          defaultValue: false,
        },
        {
          name: 'AssetCode',
          jsonPath: 'code',
          label: 'ac.create.Asset.Code',
          pattern: '',
          type: 'label',
          isRequired: false,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
        },
        {
          name: 'NameAsset',
          jsonPath: 'name',
          label: 'ac.create.Name.of.Asset',
          pattern: '',
          type: 'label',
          isRequired: false,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
        },
        {
          name: 'DateofPurchase/Construction/Acquisition',
          jsonPath: 'acquisitionDate',
          label: 'ac.transaction.create.datePurchaseConstruction',
          pattern: '',
          type: 'label',
          isRequired: false,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
          isDate: true,
        },
        {
          name: 'WdvValue',
          jsonPath: 'currentValue',
          label: 'ac.create.WDV.Value',
          pattern: '',
          type: 'label',
          isRequired: false,
          isDisabled: false,
          requiredErrMsg: '',
          patternErrMsg: '',
          isLabel: false,
        },
      ],
      // "values": ["businessService", "consumerCode", "totalAmount","minimumAmount","bill"],
      resultPath: 'Assets',
      tableResultPath: 'Revaluation.Assets',

      // "rowClickUrlUpdate": "/update/wc/pipeSize/{id}",
      // "rowClickUrlView": "/view/wc/pipeSize/{id}"
    },

    transaction: [
      {
        label: '',
        name: 'OtherDetails',
        children: [],
        fields: [
          {
            name: 'ValuationDate',
            jsonPath: 'Revaluation.revaluationDate',
            //"label": "ac.create.Revaluation.date",
            label: 'Revaluation date',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
            maxDate: 'today',
          },
          {
            name: 'OrderNo',
            jsonPath: 'Revaluation.orderNumber',
            label: 'Order No',
            pattern: '',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
          },
          {
            name: 'OrderDate',
            jsonPath: 'Revaluation.orderDate',
            //"label": "ac.transaction.create.order.date",
            label: 'Order Date',
            pattern: '',
            type: 'datePicker',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
            maxDate: 'today',
          },
          {
            name: 'ValuationAmount',
            jsonPath: 'Revaluation.valueAfterRevaluation',
            //"label": "ac.create.title",
            label: 'Value After Revaluation',
            pattern: '^[0-9]{1,10}(\\.[0-9]{0,2})?$',
            type: 'text',
            isRequired: true,
            isDisabled: false,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: 'Please enter positive number (Decimal upto 2 digits)',
          },
          {
            name: 'Addition/deductedAmount',
            jsonPath: 'Revaluation.revaluationAmount',
            //"label": "ac.transaction.create.AdditionDeductedAmount",
            label: 'Addition/ deducted amount',
            pattern: '',
            type: 'text',
            isRequired: false,
            isDisabled: true,
            requiredErrMsg: '', //Remove required messages
            patternErrMsg: '',
          },
          {
            name: 'Remarks',
            jsonPath: 'Revaluation.remarks',
            label: 'Remarks',
            pattern: '',
            type: 'textarea',
            url: '',
            isRequired: false,
            isDisabled: false,
            requiredErrMsg: '',
            patternErrMsg: '',
          },
        ],
      },
    ],

  },

};

export default dat;
