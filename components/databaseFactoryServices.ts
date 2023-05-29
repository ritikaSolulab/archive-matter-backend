import { Model } from "mongoose";
interface aggregationFilter {
  startDate: string;
  endDate: string;
}

class DataBaseFactoryServices {
  async getDetails(value: any, field: string = "id", selectString: String, model: Model<any>) {
    const userData = await model.findOne({
      [`${field}`]: value,
    }, selectString).lean();
    return userData;
  }
  async getSingleData(condition: any, populateArray: any, selectString: string, model: Model<any>) {
    const userData = await model.findOne(condition, selectString).populate(populateArray).lean();
    return userData;
  }

  async getDataFactory(
    condition: any,
    populateArray: Array<any>,
    skipLimitObj: object,
    model: Model<any>
  ) {
    // return count here also
  }

  async insertDataFactory(userData: any, model: Model<any>) {
    const data = new model(userData);
    return await data.save();
  }
  async deleteDataFactory(condition: any, model: any) {
    return await model.delete(condition);
  }
  async updateDataFactory(
    condition: any,
    updatedData: any,
    populateArray: Array<any>,
    selectString: String,
    model: Model<any>
  ) {
    return await model
      .findOneAndUpdate(
        condition,
        updatedData,
        {
          new: true,
        }
      )
      .populate(populateArray).lean();
  }
  async aggregationQuery(query: Array<any>, model: any) {
    // console.log(JSON.stringify(query))
    return await model.aggregation(query);
  }
  public aggregationSearch = (fieldArray: Array<any>, searchValue: string) => {
    const query = {
      $match: {
        $or: [
          ...fieldArray.map((field) => ({
            // eslint-disable-next-line security/detect-non-literal-regexp
            [field]: { $regex: searchValue, $options: "i" },
          })),
        ],
      },
    };
    return query;
  };
  public aggregationFilterDate = (
    queries: aggregationFilter,
    fieldName: string
  ) => {
    // eslint-disable-next-line security/detect-object-injection
    const query = {
      $match: {
        [fieldName]: {
          $gte: new Date(queries.startDate),
          $lte: new Date(queries.endDate),
        },
      },
    };
    return query;
  };
  public aggregationSkipLimit = (query: any) => {
    const facetObject = {
      $facet: {
        list: [
          { $skip: (Number(query.page) - 1) * Number(query.limit) || 0 },
          { $limit: Number(query.limit) || 10 },
        ],

        totalItem: [{ $count: "count" }],
      },
    };
    return facetObject;
  };
  public aggregationMatch = (matchCondition: Object) => {
    const matchObj = {
      $match: matchCondition,
    };
    return matchObj;
  };
  public aggregationLookup = (
    from: string,
    letCond: Object,
    matchObj: Object,
    projectObj: Object,
    asString: string,
    preserveNullAndEmptyArrays = true
  ) => {
    const lookupObj = [
      {
        $lookup: {
          from,
          let: { id: letCond },
          pipeline: [{ $match: matchObj }, { $project: projectObj }],
          as: asString,
        },
      },
      {
        $unwind: {
          path: `$${asString}`,
          preserveNullAndEmptyArrays,
        },
      },
    ];
    return lookupObj;
  };
  public aggregationGeoNear = (
    long: number,
    lat: number,
    distanceFiled: number
  ) => {
    return {
      $geoNear: {
        near: [long, lat],
        distanceField: distanceFiled,
        spherical: true,
        distanceMultiplier: 6378.1, // convert radians to kilometers
      },
    };
  };
}

export default DataBaseFactoryServices;
